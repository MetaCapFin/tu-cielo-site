import React, { useState } from 'react';
import './LoanCalculator.css';
import { Helmet } from 'react-helmet';

export default function TuCieloCalculator() {
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
    <>
    <Helmet>
      <title>HOA Loan Calculator | TuCielo Financing</title>
      <meta
        name="description"
        content="Use the TuCielo HOA loan calculator to estimate project financing, monthly payments, and amortization schedule tailored to your community."
      />
      <meta property="og:title" content="Loan Calculator | TuCielo Financing" />
      <meta property="og:description" content="Estimate your HOA project costs and monthly payments with our interactive loan calculator." />
      <meta property="og:url" content="https://www.tucielofinancing.com/calculator" />
      <meta property="og:image" content="https://www.tucielofinancing.com/cloud_logo.jpg" />
    </Helmet>

    <div className="loan-calculator">
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

        <button onClick={() => setShowFees(!showFees)}>
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

      <button onClick={() => setShowTable(!showTable)}>
        {showTable ? "Hide Amortization Table" : "Show Amortization Table"}
      </button>

      {showTable && (
        <div className="overflow-auto">
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
    </div>
  );
</>
}
