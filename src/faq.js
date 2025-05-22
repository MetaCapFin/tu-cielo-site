import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: 'Q1. What types of projects are eligible?',
      answer:
        'We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.',
    },
    {
      question: 'Q2. Can we finance reserve shortfalls?',
      answer:
        'Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.',
    },
    {
      question: 'Q3. How long does the process take?',
      answer:
        'Most communities receive funding within 30 to 60 days from initial consultation to closing.',
    },
    {
      question: 'Q4. Is personal homeowner credit required?',
      answer:
        'No. We do not require individual homeowner credit checks or personal guarantees.',
    },
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>

      {faqs.map(({ question, answer }, i) => (
        <div className="faq-item" key={i}>
          <h3 className="faq-question">{question}</h3>
          <p className="faq-answer">{answer}</p>
        </div>
      ))}

      <button
        className="back-to-main"
        onClick={() => window.location.href = '/'}
      >
        Back to Main Page
      </button>
    </section>
  );
}

