import React, { useState } from 'react';

const faqData = [
  { question: 'Q1. What types of projects are eligible?', answer: 'We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.' },
  { question: 'Q2. Can we finance reserve shortfalls?', answer: 'Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.' },
  { question: 'Q3. How long does the process take?', answer: 'Most communities receive funding within 30 to 60 days from initial consultation to closing.' },
  { question: 'Q4. Is personal homeowner credit required?', answer: 'No. We do not require individual homeowner credit checks or personal guarantees.' },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div key={index} className="faq-item" style={{ marginBottom: 15, cursor: 'pointer' }} onClick={() => toggleFAQ(index)}>
          <div className="faq-question" style={{ fontWeight: 'bold', fontSize: 18 }}>{item.question}</div>
          <div
            className="faq-answer-wrapper"
            style={{
              maxHeight: activeIndex === index ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
            }}
          >
            <div className="faq-answer" style={{ padding: '10px 0' }}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FAQSection;




