import React, { useState, useEffect } from 'react'; // ✅ Make sure useEffect is imported
import { Link } from "react-router-dom"; // Make sure react-router-dom is installed and set up
import "./FAQ.css";

export default function FAQ() {
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
  const handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  return (
    <div className="page-container">
      {/* HEADER */}
       <header className="site-header">
     <div className="tucielo-header-top">
        <div className="logo-title">
          <img src="/TuCielo-Header-Logo2.png" alt="Logo" />
        </div>
      
        <div className="beta-label">
          <img src="BetaProgram_Sticker.png" alt="Beta Program" />
        </div>
      </div>
        <div className="header-bottom">
          <Link to="/blogposts" className="header-button-link">Blog</Link>
          <Link to="/contractor-proposal-tool" className="header-button-link">TuCielo Calculator</Link>
        </div>
      </header>

      <div className="faq-container">
        <section className="faq-questions">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>What types of projects are eligible?</h3>
            <p>We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.</p>
          </div>

          <div className="faq-item">
            <h3>Can we finance reserve shortfalls?</h3>
            <p>Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.</p>
          </div>

          <div className="faq-item">
            <h3>How long does the process take?</h3>
            <p>Most communities receive funding within 30 to 60 days from initial consultation to closing.</p>
          </div>

          <div className="faq-item">
            <h3>Is personal homeowner credit required?</h3>
            <p>No. We do not require individual homeowner credit checks or personal guarantees.</p>
          </div>
        </section>

        <div className="faq-cta">
          <button className="cta-button" onClick={handleGoHome}>
            Back to TuCielo
          </button>
        </div>
      </div>

      {/* FOOTER */}
        <footer className="site-footer">
          <p>© 2025 Tu Cielo. All rights reserved.</p>
          <br />
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

