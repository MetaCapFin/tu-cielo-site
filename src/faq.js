import React, { useState, useEffect } from 'react'; // ✅ Make sure useEffect is imported
import { Link } from "react-router-dom"; // Make sure react-router-dom is installed and set up
import "./FAQ.css";
import "./App.css";

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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };
  
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  return (
  <>
  <div className="faq-page-container">
    {/* HEADER */}
        <header className="siteHeader">
            <div className="tucieloHeaderTop">
              <Link to="/" className="logoTitle img" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/TuCielo-Header-Logo2.png" alt="Logo" />
              </Link>
    
              <div className="betaLabel img">
                <img src="BetaProgram_Sticker.png" alt="Beta Program" />
              </div>
    
              <div className="hamburger" onClick={() => setIsMobileMenuOpen(prev => !prev)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
    
            <div className={`headerBottom ${isMobileMenuOpen ? 'menuOpen' : ''}`}>
              <div className="headerScrollContainer">
                <Link to="/contractor-proposal-tool" className="headerButtonLink">TuCielo Calculator</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
                <Link to="/faq" className="headerButtonLink">FAQ</Link>
                <Link to="/blogposts" className="headerButtonLink">Blog</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    setShowPrivacyModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Privacy Policy
                </button>
              </div>
            </div>
    
            {isMobileMenuOpen && (
              <div className="mobile-menu show">
                <Link to="/contractor-proposal-tool" className="headerButtonLink">TuCielo Calculator</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Apply
                </button>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
                <Link to="/faq" className="headerButtonLink">FAQ</Link>
                <Link to="/blogposts" className="headerButtonLink">Blog</Link>
                <button
                  className="headerButtonLink"
                  onClick={() => {
                    setShowPrivacyModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Privacy Policy
                </button>
              </div>
            )}
    
            {showPrivacyModal && (
              <div className="privacypolicy-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                <div className="privacypolicy-modal-content" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>X</button>
                  <div className="privacypolicy-modal-body">
                    <h2>Privacy Policy</h2>
                    <p>
                      At TuCielo, we are committed to protecting the privacy of our users and the confidentiality of the data we collect.
                      This document outlines how we collect, use, and protect your information when you use our website and submit an application
                      for HOA lending services, as well as the terms and conditions for using our services.
                    </p>
                    <h3>Information We Collect</h3>
                    <ul>
                      <li>Association name, address, and contact details</li>
                      <li>Financial documents (budgets, reserve studies, project bids)</li>
                      <li>Board member and CAM contact information</li>
                      <li>Any other information submitted through our application form</li>
                    </ul>
                    <h3>How We Use Your Information</h3>
                    <p>Your data is used exclusively for the purpose of evaluating and processing your HOA loan application. We do not sell or rent your personal information.</p>
                    <h3>Consent</h3>
                    <p>By submitting your information through our website, you consent to our use of your data in accordance with this policy. Consent is obtained explicitly via checkboxes on our application form.</p>
                    <h3>Data Retention</h3>
                    <p>We retain submitted documents for no more than 180 days unless an active loan application is in process. Files are automatically deleted thereafter.</p>
                    <h3>Data Security</h3>
                    <p>We use industry-standard encryption (HTTPS, AES-256) to protect all data transfers and storage. Access to uploaded files is restricted to authorized TuCielo personnel only.</p>
                    <h3>Your Rights</h3>
                    <p>You may request access, correction, or deletion of your data by contacting us at tucielofinancing.com.</p>
                    <h3>Updates</h3>
                    <p>This Privacy Policy may be updated periodically. Continued use of the site constitutes acceptance of the updated terms.</p>
    
                    <h2>Terms of Service</h2>
                    <h3>Acceptance of Terms</h3>
                    <p>By using this website and submitting information, you agree to these Terms of Service and our Privacy Policy.</p>
                    <h3>Use of Services</h3>
                    <p>You agree to use our services for lawful purposes only and to provide accurate, non-fraudulent information.</p>
                    <h3>Document Uploads</h3>
                    <p>You acknowledge that uploaded documents must be HOA-approved and free of viruses or malicious content. Only PDF, DOCX, XLS, and CSV formats are accepted. Maximum file size is 25MB.</p>
                    <h3>No Guarantee of Financing</h3>
                    <p>Submission of an application does not guarantee loan approval. TuCielo reserves the right to deny applications at our sole discretion.</p>
                    <h3>Intellectual Property</h3>
                    <p>All content on this website is the property of TuCielo and may not be reproduced without written consent.</p>
                    <h3>Limitation of Liability</h3>
                    <p>TuCielo shall not be liable for any indirect or consequential damages arising from the use of this site or our services.</p>
                    <h3>Governing Law</h3>
                    <p>These terms shall be governed by the laws of the State of Florida.</p>
                    <h3>Contact</h3>
                    <p>For questions regarding these Terms, contact us at tucielofinancing.com.</p>
                  </div>
                </div>
              </div>
            )}
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

    </div>

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
  </>
);

}

