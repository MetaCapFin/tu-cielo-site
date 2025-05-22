// src/contractor-proposal-tool.jsx
import React, { useState } from 'react';
import './contractor-proposal-tool.css'; // keep your styles separate as needed

export default function ContractorProposalTool() {
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Contractor Proposal Tool</h1>
      <p>This feature is coming soon! Meanwhile, check out this calculator:</p>
      <TuCieloCalculator />
    </div>
  );
}

// Calculator component is nested inside to keep things modular and separate
function TuCieloCalculator() {
  const [units, setUnits] = useState(50);
  const [cost, setCost] = useState(1000000);
  const [term, setTerm] = useState(25);
  const [showTable, setShowTable] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const rate = 0.0999;
  const monthlyRate = rate / 12;
  const totalPayments = term * 12;

  const originationFee = cost * 0.05;
  const tempMonthlyPayment = (cost * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  const debtServiceReserve = tempMonthlyPayment * 10;
  const totalLoan = cost + originationFee + debtServiceReserve;

  const monthlyPayment = (totalLoan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  const perUnitPayment = monthlyPayment / units;

  const generateAmortization = () => {
    let balance = totalLoan;
    const schedule = [];
    for (let i = 1; i <= totalPayments; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principal,
        interest: interest,
        balance: balance > 0 ? balance : 0
      });
    }
    return schedule;
  };

  const formatNumber = (num) =>
    num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const amortizationTable = generateAmortization();

  return (
    <div className="loan-calculator" style={{ marginTop: 30 }}>
      <h2>TuCielo HOA Loan Proposal Calculator</h2>

      <label>Number of Units</label>
      <input
        type="number"
        value={units}
        min={1}
        onChange={(e) => setUnits(Number(e.target.value))}
        className="input"
      />

      <label>Cost of Project or Reserves to Finance: ${cost.toLocaleString()}</label>
      <input
        type="range"
        min={1000000}
        max={10000000}
        step={50000}
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
      />

      <label>Select Loan Term</label>
      <select
        value={term}
        onChange={(e) => setTerm(Number(e.target.value))}
        className="input"
      >
        <option value={10}>10 Years</option>
        <option value={15}>15 Years</option>
        <option value={20}>20 Years</option>
        <option value={25}>25 Years</option>
      </select>

      <div>
        <p><strong>Interest Rate:</strong> {(rate * 100).toFixed(2)}%</p>
        <p><strong>Term:</strong> {term} Years</p>

        <button onClick={() => setShowFees(!showFees)} style={{ marginBottom: 10 }}>
          {showFees ? "Hide Fees and Total Financed Amount" : "Show Fees and Total Financed Amount"}
        </button>

        {showFees && (
          <div>
            <p><strong>Origination Fee:</strong> ${formatNumber(originationFee)}</p>
            <p><strong>Debt Service Coverage Reserve:</strong> ${formatNumber(debtServiceReserve)}</p>
            <p><strong>Total Financed Amount:</strong> ${formatNumber(totalLoan)}</p>
          </div>
        )}

        <p><strong>Total Monthly Payment Association:</strong> ${formatNumber(monthlyPayment)}</p>
        <p className="text-xl"><strong>Monthly Payment Per Unit:</strong> ${formatNumber(perUnitPayment)}</p>
      </div>

      <button onClick={() => setShowTable(!showTable)} style={{ marginTop: 15 }}>
        {showTable ? "Hide Amortization Table" : "Show Amortization Table"}
      </button>

      {showTable && (
        <div className="overflow-auto" style={{ maxHeight: 300, marginTop: 15 }}>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationTable.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>${formatNumber(item.payment)}</td>
                  <td>${formatNumber(item.principal)}</td>
                  <td>${formatNumber(item.interest)}</td>
                  <td>${formatNumber(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="tooltip-text" style={{ marginTop: 40 }}>
        <p>Before starting please gather the following information:</p>
        <ul>
          <li>1. HOA legal entity name</li>
          <li>2. Number of units</li>
          <li>3. Year built of condominium</li>
          <li>4. Contact Info</li>
          <li>5. Type of project</li>
          <li>6. Cost of improvement/Reserves</li>
          <li>7. Loan amount needed</li>
          <li>8. Average monthly dues per Unit</li>
          <li>9. Current reserve fund balance</li>
          <li>10. Annual Operating Budget</li>
          <li>11. Delinquency Rate Percentage</li>
          <li>12. Reserves studies PDF (500MB max)</li>
          <li>13. Annual Budget PDF (500MB max)</li>
        </ul>
      </div>
    </div>
  );
}




