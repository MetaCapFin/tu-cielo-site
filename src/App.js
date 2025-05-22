import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TuCieloHOALoanApplication from './components/tucielo_hoa_loan_application';
import LoanCalculator from './components/LoanCalculator'; // Adjust path if needed
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import ContractorProposalTool from './contractor-proposal-tool';
import FAQ from './faq'; // from src/faq.js

function Homepage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoanCalculatorModal, setShowLoanCalculatorModal] = useState(false);
  const [showApplicationFormModal, setShowApplicationFormModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formValid, setFormValid] = useState(false);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [calculatorLeadForm, setCalculatorLeadForm] = useState({
    name: '',
    company: '',
    email: '',
  });
  const [showCalculator, setShowCalculator] = useState(false);

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: '',
    community: '',
    city: '',
    role: '',
    budget: '',
    email: '',
    phone: '',
  });

  // FAQ toggle handler
  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Download guide form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setFormValid(updated.name.trim() !== '' && updated.email.trim() !== '');
  };

  // Download guide handler
  const handleDownload = () => {
    if (formValid) {
      const link = document.createElement('a');
      link.href = '/TuCielo_HOA_Lending_Guide.pdf'; // ✅ Correct path
      link.download = 'TuCielo_HOA_Lending_Guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowModal(false);
      setFormData({ name: '', email: '' });
    } else {
      alert('Please enter both name and email.');
    }
  };

  // Contact form input change handler
    const handleContactFormChange = (e) => {
      const { name, value } = e.target;
      setContactFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Contact form submit handler
    const handleContactFormSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!contactFormData.name.trim() || !contactFormData.email.trim()) {
      alert('Please enter both Name and Email.');
      return;
    }
  
    // Prepare payload with budget as number
    const payload = {
      ...contactFormData,
      budget: Number(contactFormData.budget) || 0,
    };
  
    try {
      const response = await fetch('/api/submitContactForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
  
      alert('Thank you! Your information has been submitted.');
  
      // Reset form fields
      setContactFormData({
        name: '',
        community: '',
        city: '',
        role: '',
        budget: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      alert('Error submitting form. Please try again later.');
      console.error('Error submitting form:', error);
    }
  };

   return (
    
     <>
      <Helmet>
        <title>TuCielo HOA Loans | Fast Community Project Funding</title>
        <meta name="description" content="Get low-interest HOA financing with TuCielo. Fast approvals, expert support, and no hidden fees." />

        {/* Open Graph (Facebook) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tucielofinancing.com/" />
        <meta property="og:title" content="TuCielo HOA Lending" />
        <meta property="og:description" content="Flexible funding for your HOA or community project. Apply online now." />
        <meta property="og:image" content="https://www.tucielofinancing.com/share-preview.jpg" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.tucielofinancing.com/" />
        <meta name="twitter:title" content="TuCielo HOA Lending" />
        <meta name="twitter:description" content="Flexible funding for your HOA or community project. Apply online now." />
        <meta name="twitter:image" content="https://www.tucielofinancing.com/share-preview.jpg" />

        <link rel="canonical" href="https://www.tucielofinancing.com/" />
      </Helmet>

  <div className="page-container">
      {/* HEADER */}
      <header className="site-header">
        <div className="header-top">
        <div className="logo-title">
          <div className="logo-placeholder">
            <img src="/cloud_logo.jpg" alt="Logo" />
          </div>
          <h1>Tu Cielo</h1>
        </div>
        <div className="beta-label">
          <strong>Beta Program</strong>
        </div>
      </div>
      <div className="header-bottom">
        <button
          className="header-button"
          onClick={() =>
            document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Contact Us
        </button>
        <button className="header-button"onClick={() => setShowPrivacyModal(true)}> Privacy Policy</button>
        <Link to="/faq">
          <button className="header-button">FAQ</button>
        </Link>
        <button className="header-button">Blog</button>
        <button className="header-button"onClick={() => {document.getElementById("application-section")?.scrollIntoView({ behavior: "smooth" });}}>
          Apply
        </button>
        <Link to="contractor-proposal-tool">
          <button className="header-button">Contractor Proposal Tools</button>
        </Link>
      </div>
      {showPrivacyModal && (
          <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>X</button>
              <div className="modal-body">
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


      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* FEATURE SECTION */}
          <section className="header-features">
            <div className="header">
              <h2><strong>HOA Improvements Without Special Assessments? Yes, It’s Possible.</strong></h2>
              <h3>Flexible, long-term financing for Florida communities — without the red tape of traditional banks.</h3>
              <img src="before-after-building.jpg" alt="HOA financing illustration placeholder" />
              <p>Before your board makes any major funding decision, you need the facts. <strong>Download now</strong> and walk into your next board meeting informed, empowered, and prepared to lead.</p>

              {/* ORIGINAL MODAL */}
              <button className="cta-button" onClick={() => setShowModal(true)}>
                10 Insights for your HOA Loan
              </button>

              {/* MODAL WITH FORM */}
              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button className="close-button" onClick={() => setShowModal(false)}>×</button>
                    <h3>Get Your 10 Insights</h3>
                    <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} />
                    <button className="cta-button" onClick={handleDownload}>Get Insights</button>
                  </div>
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="features">
              <div className="pain-points-section">
                <h2>Why Most Florida HOAs Struggle to Fund Capital Projects</h2>
                <ul className="pain-points-list">
                  <li>Bank loans require large reserves and perfect financials</li>
                  <li>Special assessments are unpopular with residents</li>
                  <li>Reserve studies reveal millions in needed repairs</li>
                </ul>
                <h3 className="subheadline">TuCielo is here to help.</h3>
                <p className="supporting-text">
                  We provide long-term, fixed-rate financing options for HOAs needing to fund major improvements — without burdening homeowners or sacrificing reserve funds.
                </p>
              </div>

              <h2>Designed for HOAs, Not Just for Banks</h2>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>TuCielo</th>
                    <th>Traditional Bank</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Loan Terms</td><td>Up to 25 years</td><td>Typically 5-10 years</td></tr>
                  <tr><td>Minimum Loan</td><td>$1,000,000+</td><td>Varies</td></tr>
                  <tr><td>Underwriting</td><td>Flexible, Holistic</td><td>Strict financial criteria</td></tr>
                  <tr><td>Prepayment</td><td>Flexible options</td><td>Often penalties apply</td></tr>
                  <tr>
                    <td>No hammer clause</td>
                    <td>
                      <div className="checkmark-circle">
                        <svg viewBox="0 0 24 24" className="checkmark-icon">
                          <path fill="white" d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                        </svg>
                      </div>
                    </td>
                    <td>
                      <div className="x-icon">
                        <svg viewBox="0 0 24 24" className="x-svg">
                          <line x1="6" y1="6" x2="18" y2="18" stroke="#d32f2f" strokeWidth="2" />
                          <line x1="6" y1="18" x2="18" y2="6" stroke="#d32f2f" strokeWidth="2" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p><strong>*Get your full program guideline by requesting a free estimate below</strong></p>
              </div>
          </section>

          {/* ESTIMATE SECTION */}
          <section>
            <div className="payment-estimate-section">
              <h2>What Could Your Association Payment Look Like?</h2>
              <div className="payment-breakdown-wrapper">
                <div className="payment-breakdown">
                  
                  {/* Modal Trigger */}
                  <button className="cta-button" onClick={() => setShowLoanCalculatorModal(true)}>
                    Get Your FREE Custom Estimate
                  </button>

                  <p className="payment-note">
                    No hammer clause | DSCR included | Fixed-rate periods up to 12.5 years
                  </p>

                  {/* Loan Calculator Modal */}
                  {showLoanCalculatorModal && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <button className="close-button" onClick={() => {
                          setShowLoanCalculatorModal(false);
                          setShowCalculator(false);
                          setCalculatorLeadForm({ name: '', company: '', email: '' });
                        }}>×</button>

                       {/* Lead Form or Calculator */}
                        {!showCalculator ? (
                          <div>
                            <h3>Get Your Free Estimate</h3>
                            <input
                              type="text"
                              name="name"
                              placeholder="Your Name"
                              value={calculatorLeadForm.name}
                              onChange={(e) =>
                                setCalculatorLeadForm({ ...calculatorLeadForm, name: e.target.value })
                              }
                            />
                            <input
                              type="text"
                              name="company"
                              placeholder="Company / Community"
                              value={calculatorLeadForm.company}
                              onChange={(e) =>
                                setCalculatorLeadForm({ ...calculatorLeadForm, company: e.target.value })
                              }
                            />
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={calculatorLeadForm.email}
                              onChange={(e) =>
                                setCalculatorLeadForm({ ...calculatorLeadForm, email: e.target.value })
                              }
                            />
                            <button
                              className="cta-button"
                              onClick={() => {
                                // Download the PDF
                                const link = document.createElement('a');
                                link.href = '/TuCielo_Program_Guidelines_Legal.pdf';
                                link.download = 'TuCielo_Program_Guidelines_Legal.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                // Show the calculator
                                setShowCalculator(true);
                              }}
                              disabled={
                                !calculatorLeadForm.name.trim() ||
                                !calculatorLeadForm.company.trim() ||
                                !calculatorLeadForm.email.trim()
                              }
                            >
                              Submit
                            </button>
                          </div>
                        ) : (
                          <LoanCalculator />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* HOW IT WORKS */}
          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps-visual">
              <div className="step-group"><div className="step-circle">1</div><div className="step-line-horizontal" /><p>Consultation & Pre-Qualification</p></div>
              <div className="step-group"><div className="step-circle">2</div><div className="step-line-horizontal" /><p>Customized Financing Proposal</p></div>
              <div className="step-group"><div className="step-circle">3</div><p>Board Approval & Funding</p></div>
            </div>
            <p className="how-it-works-note">No appraisals. No unit-level credit checks. Fast approvals.</p>
          </section>

          {/* ESTIMATE SECTION */}
          <section id="application-section">
          <div className="payment-estimate-section">
            <h2>Click Below to Submit Your Application</h2>
            <div className="payment-breakdown-wrapper">
              <div className="payment-breakdown">
                
                {/* Button with Tooltip */}
                <div style={{ textAlign: 'center' }}>
                  <div className="tooltip-container">
                    <button className="cta-button" onClick={() => setShowApplicationFormModal(true)}>
                      <strong>Start Application</strong>
                    </button>
                    <div className="tooltip-text">
                      Before starting please gather the following information:
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
                    </div>
                  </div>
                </div>
               
                {/* Application Form Modal */}
                {showApplicationFormModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <button className="close-button" onClick={() => setShowApplicationFormModal(false)}>×</button>
                      <TuCieloHOALoanApplication onClose={() => setShowApplicationFormModal(false)} />
                    </div>
                  </div>
                )}
             </div>
            </div>
          </div>
        </section>


          {/* CONTACT FORM */}
          <section id="contact-section" className="contact-form">
            <h2>Let's Talk About Your Community's Needs</h2>
            <div className="form-container">
              <div className="form-image">
                <img src="hoa1.jpg" alt="Community" />
              </div>
              <form onSubmit={handleContactFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={contactFormData.name}
                  onChange={handleContactFormChange}
                  required
                />
                <input
                  type="text"
                  name="community"
                  placeholder="HOA or Community Name"
                  value={contactFormData.community}
                  onChange={handleContactFormChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={contactFormData.city}
                  onChange={handleContactFormChange}
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Title"
                  value={contactFormData.role}
                  onChange={handleContactFormChange}
                />
                <input
                  type="number"
                  name="budget"
                  placeholder="Amount requested"
                  value={contactFormData.budget}
                  onChange={handleContactFormChange}
                  min="0"
                  step="any"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={contactFormData.email}
                  onChange={handleContactFormChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={contactFormData.phone}
                  onChange={handleContactFormChange}
                />
                <button type="submit" className="cta-button">Submit</button>
              </form>
            </div>
          </section>
         </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <p>© 2023 Tu Cielo. All rights reserved.</p>

        <p>
          Tu Cielo’s financing programs are not government-sponsored, and no government assistance is available to pay any associated assessments.
          All improvements financed through Tu Cielo must be installed by your chosen contractor. Tu Cielo and any affiliated entities do not
          provide installation services and are not government agencies.
        </p>
        <p>
          Financing is offered by Tu Cielo and its affiliated partners. Tu Cielo is not a licensed lender or broker. Licensing and regulatory
          compliance may vary by state or region.
        </p>
        <p>
          *The timing of your first payment depends on the time of funding; interest begins accruing once funds are disbursed.*
        </p>
        <p>
          <strong>Tu Cielo secures financing through a recorded lien on the HOA.</strong>
        </p>
        <p>
          All terms, conditions, and results are project-specific and may vary.
          <br />
          - Financing terms may vary and will depend on Tu Cielo’s underwriting criteria without prior notice.
          <br />
          - Payment estimates are for budgeting purposes only. Tu Cielo financing is repaid through your HOA. Payment amounts may depend on term,
          rates, fees, number of units, and any other covenants agreed upon between the HOA and the lender.
          <br />
          - Monthly estimated payments are based on total financed amounts. Please consult a Tu Cielo representative for personalized estimates.
        </p>
      </footer>
    </div>
  </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/hoa-application" element={<TuCieloHOALoanApplication />} />
        <Route path="/contractor-proposal-tool" element={<ContractorProposalTool />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App; 

