import React from 'react';

export default function FAQ() {
  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>

      <div className="faq-item">
        <h3 className="faq-question">Q1. What types of projects are eligible?</h3>
        <p className="faq-answer">
          We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Q2. Can we finance reserve shortfalls?</h3>
        <p className="faq-answer">
          Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Q3. How long does the process take?</h3>
        <p className="faq-answer">
          Most communities receive funding within 30 to 60 days from initial consultation to closing.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Q4. Is personal homeowner credit required?</h3>
        <p className="faq-answer">
          No. We do not require individual homeowner credit checks or personal guarantees.
        </p>
      </div>

      <button
        className="back-to-main"
        onClick={() => (window.location.href = '/')}
      >
        Back to Main Page
      </button>
    </div>
  );
}


