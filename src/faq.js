import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQSection.css';

const faqData = [
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

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">{item.question}</div>
          {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
        </div>
      ))}
      <button className="back-home-button" onClick={() => navigate('/')}>
        Back to Main Page
      </button>
    </section>
  );
};

export default FAQSection;
