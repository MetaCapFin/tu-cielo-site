// src/contractor-proposal-tool.jsx
import React, { useState, useEffect } from 'react'; // ✅ Make sure useEffect is imported
import { Link } from 'react-router-dom';
import './contractor-proposal-tool.css';
import { Helmet } from 'react-helmet'; // ✅ import Helmet

export default function ContractorProposalTool() {
  // ✅ Inject background effect after last useState
  useEffect(() => {
    document.body.style.backgroundImage = "url('/Fluffy_Clouds_Background.png')";
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
    };
  }, []);
  return (
    <>
      <Helmet>
      <title>TuCielo Contractor Proposal Tool</title>
      <meta name="description" content="Estimate your HOA project financing with TuCielo’s Contractor Proposal Tool. See per-unit payments, amortization, and fee breakdown instantly." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta property="og:title" content="TuCielo Contractor Proposal Tool" />
      <meta property="og:description" content="Estimate your HOA project financing with TuCielo’s Contractor Proposal Tool. Includes per-unit calculations, amortization table, and fee insights." />
      <meta property="og:image" content="/TuCielo_ProposalCalculator.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://intel-ventures.com/contractor-proposal-tool" />
    </Helmet>
      
    <div className="page-container">
      {/* HEADER */}
      <header className="site-header">
        <div className="header-top">
          <div className="logo-title">
             <img src="/TuCielo_ProposalCalculator-removebg.png" alt="Logo" />
          </div>

        <div className="beta-label">
          <img src="BetaProgram_Sticker.png" alt="Beta Program" />
        </div>
          
        </div>
        <div className="header-bottom">
          <Link to="/faq" className="header-button-link">FAQ</Link>
          <Link to="/blogposts" className="header-button-link">Blog</Link>
        </div>
      </header>

      {/* Main content */}
      <div className="calculator-wrapper">
         <TuCieloCalculator />
      </div>
    </div>
    </>
  );
}

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
        principal,
        interest,
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
    <div className="page-container">
    <div className="loan-calculator" style={{ marginTop: 30 }}>
          
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

      <section className="info-section" style={{ marginTop: 40, background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
        <h3>Before You Begin</h3>
        <p>Please gather the following information:</p>
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
      </section>

      <button
        className="back-to-main"
        onClick={() => window.location.href = '/'}
      >
        Back to TuCielo
      </button>     
    </div>
     
  {/* FOOTER */}
      <footer className="site-footer">
        <p>© 2025 Tu Cielo. All rights reserved.</p>
        <br></br>
        <p>
          Disclaimer: TuCielo and any affiliated entities do not provide installation services and are not government agencies. All terms, conditions,
          and results are project-specific and may vary. Financing terms may change and are subject to TuCielo’s underwriting criteria without prior
          notice. Payment estimates are for budgeting purposes only and are based on total financed amounts. TuCielo financing is repaid through your
          HOA, and monthly payments may vary based on loan term, interest rate, fees, number of units, and other covenants agreed upon between the HOA
          and the lender. This website does not constitute an offer to lend. Please consult a TuCielo representative for personalized estimates.
        </p>
      </footer>
      </div>
  );
}







