import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    question: "Q1. What types of projects are eligible?",
    answer:
      "We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.",
  },
  {
    question: "Q2. Can we finance reserve shortfalls?",
    answer:
      "Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.",
  },
  {
    question: "Q3. How long does the process take?",
    answer:
      "Most communities receive funding within 30 to 60 days from initial consultation to closing.",
  },
  {
    question: "Q4. Is personal homeowner credit required?",
    answer:
      "No. We do not require individual homeowner credit checks or personal guarantees.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className="faq-section"
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "'Mulish', sans-serif",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div
          key={index}
          className="faq-item"
          style={{ marginBottom: 15, cursor: "pointer" }}
          onClick={() => toggleFAQ(index)}
        >
          <div
            className="faq-question"
            style={{
              fontWeight: "bold",
              fontSize: 18,
              userSelect: "none",
              padding: "10px 15px",
              backgroundColor: "#f0f7fb",
              borderRadius: 6,
            }}
          >
            {item.question}
          </div>
          <div
            className="faq-answer-wrapper"
            style={{
              maxHeight: activeIndex === index ? 500 : 0,
              overflow: "hidden",
              transition: "max-height 0.5s ease",
              backgroundColor: "#e8f1f7",
              borderRadius: "0 0 6px 6px",
              padding: activeIndex === index ? "10px 15px" : "0 15px",
            }}
          >
            <div className="faq-answer" style={{ fontSize: 16, lineHeight: 1.4 }}>
              {item.answer}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => navigate("/")} // adjust "/" to your main page path if needed
        style={{
          marginTop: 30,
          display: "block",
          width: "100%",
          padding: "12px 0",
          fontSize: 18,
          fontWeight: "bold",
          color: "white",
          background:
            "linear-gradient(to bottom left, #2184BD, #1C7FB8)",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'Mulish', sans-serif",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(to bottom left, #1C7FB8, #2184BD)";
          e.currentTarget.style.color = "#303c42";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(to bottom left, #2184BD, #1C7FB8)";
          e.currentTarget.style.color = "white";
        }}
      >
        Back to Main Page
      </button>
    </section>
  );
};

export default FAQSection;





