import React from "react";
import "./FAQ.css";

export default function FAQ() {
  const handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  return (
    {/* HEADER */}
      <header className="site-header">
        <div className="header-top">
        <div className="logo-title">
          <div className="logo-placeholder">
            <img src="/cloud_logo.jpg" alt="Logo" />
          </div>
          <h1>TuCielo</h1>
        </div>
        <div className="beta-label">
          <strong>Beta Program</strong>
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
  );
}

