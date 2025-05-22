import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Frequently Asked Questions</h1>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Q1. What types of projects are eligible?</strong></p>
        <p>We finance a wide range of capital improvements including roofing, paving, elevators, HVAC systems, and more.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Q2. Can we finance reserve shortfalls?</strong></p>
        <p>Yes. Our financing can help cover reserve shortfalls identified in your reserve study or upcoming capital needs.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Q3. How long does the process take?</strong></p>
        <p>Most communities receive funding within 30 to 60 days from initial consultation to closing.</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q4. Is personal homeowner credit required?</strong></p>
        <p>No. We do not require individual homeowner credit checks or personal guarantees.</p>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Back to Main Page
      </button>
    </div>
  );
}
