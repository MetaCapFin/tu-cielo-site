import React, { useState, useEffect } from 'react';
import './blogposts.css';
import { Link } from 'react-router-dom';



const BlogPosts = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Comments state: each comment = { id, text, userId }
  const [comments, setComments] = useState([]);

  // Controlled textarea for comment input
  const [commentText, setCommentText] = useState('');

  // User ID stored in localStorage to identify commenter
  const [userId, setUserId] = useState(null);

  // On mount, initialize or get userId from localStorage
  useEffect(() => {
  document.body.style.backgroundImage = "url('/Fluffy_Clouds_Background.png')";
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.minHeight = '100vh';

  let storedUserId = localStorage.getItem('userId');
  if (!storedUserId) {
    storedUserId = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('userId', storedUserId);
  }
  setUserId(storedUserId);

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
  
   
    
  // Handler to add comment
  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return; // don't add empty comments

    const newComment = {
      id: Date.now(),
      text: trimmed,
      userId,
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  // Handler to delete comment by id (only if userId matches)
  const handleDelete = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <div className="page-container">
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

      {/* MAIN BLOG POST */}
      <main className="main-content">
        <div className="content-wrapper-blog-section">
          <h2 className="blog-title">
            The Florida HOA Financing Crisis: Why Traditional Banks Are Failing Communities When They Need Capital Most
          </h2>
          <article className="blog-article">
            {/* ... Your entire article content unchanged ... */}
            <p>
              <em> I have spent months analyzing the unprecedented challenges facing Florida's condominium communities. What I've discovered reveals a fundamental breakdown in how traditional lenders approach HOA financing in our post-Surfside reality.</em>
            </p>

            <h3>The Numbers Tell a Devastating Story</h3>
            <p>The financial pressure on Florida HOAs has reached crisis levels, and the data is staggering:</p>
            <p><strong>Skyrocketing Costs:</strong></p>
            <ul>
              <li>Median monthly HOA fees surged 68% in just three years—from $232 in 2022 to $390 in April 2025</li>
              <li>Tampa leads with a 17.2% year-over-year increase, followed by Orlando at 16.7%</li>
              <li>Miami commands the highest fees at $835 monthly, though growth has slowed due to already-elevated baseline costs</li>
            </ul>

            <p><strong>Assessment Shock:</strong></p>
            <ul>
              <li>Special assessments now range from $500 to over $400,000 per unit</li>
              <li>Individual owners report assessment bills exceeding $10,000 in a single year</li>
              <li>Structural repairs alone can cost $15,000 to $75,000 per unit</li>
            </ul>

            <p><strong>Market Displacement:</strong></p>
            <ul>
              <li>Buildings over 30 years old have lost 22% of their value in just two years</li>
              <li>Over 1,400 Florida condo associations are blacklisted from Fannie Mae financing</li>
              <li>Condo inventory has reached 9.7 months of supply, compared to 5.3 months for single-family homes</li>
            </ul>

            <p>These aren't just statistics—they represent families being displaced from their homes and communities being torn apart by financial impossibility.</p>

            <h3>The Post-Surfside Regulatory Reality</h3>
            <p>
              The tragic Champlain Towers South collapse exposed decades of deferred maintenance and inadequate financial planning. Florida's response was swift and comprehensive:
            </p>

            <p><strong>New Mandates Include:</strong></p>
            <ul>
              <li>Milestone structural inspections for buildings 25-30+ years old</li>
              <li>Structural Integrity Reserve Studies (SIRS) every 10 years</li>
              <li>Full reserve funding with no more waivers</li>
              <li>Compliance deadlines that initially seemed impossible to meet</li>
            </ul>

            <p>
              While these regulations are absolutely necessary for public safety, they've created an immediate financial reckoning. Associations that deferred maintenance for decades now face compressed timelines to fund millions in repairs—exactly when traditional financing has become unavailable.
            </p>

            <h3>Why Traditional Banks Are Retreating</h3>
            <p>In my conversations with property managers across South Florida, I hear the same frustration repeatedly: "I'm tired of delivering bad news with no solutions."</p>

            <p>Here's why traditional banks are failing HOA communities:</p>

            <h4>Risk Model Mismatch</h4>
            <ul>
              <li><strong>Personal guarantees required:</strong> Banks want board members to personally guarantee million-dollar loans—an impossible ask for volunteer directors</li>
              <li><strong>Perfect metrics demanded:</strong> Many banks cap approvals at 7% delinquency, ignoring the reality that post-crisis communities often face temporary payment challenges</li>
              <li><strong>Short-term thinking:</strong> Banks offer 2-5 year terms, creating refinancing risk precisely when communities need stability</li>
            </ul>

            <h4>Compliance Cost Confusion</h4>
            <p>Banks see post-Surfside compliance requirements as additional risk factors rather than necessary investments in long-term viability. They're retreating from older buildings exactly when these communities need capital most.</p>

            <h4>Operational Inflexibility</h4>
            <p>Traditional banks require extensive banking relationships, perfect documentation, and 90-120 day approval timelines. Communities facing compliance deadlines can't wait four months for a "maybe."</p>

            <h3>The Hidden Cost of Inaction</h3>
            <p>When banks retreat, communities face devastating alternatives:</p>

            <p><strong>Special Assessment Shock:</strong></p>
            <p>A $2 million repair project in a 100-unit building means $20,000 per unit immediately. For many residents—particularly seniors on fixed incomes—this represents an impossible financial demand.</p>

            <p><strong>Community Displacement:</strong></p>
            <p>Unable to pay massive assessments, long-term residents are forced to sell, often at depressed prices due to known repair issues. This destroys the social fabric that makes communities valuable.</p>

            <p><strong>Property Value Destruction:</strong></p>
            <p>Buildings with identified structural issues and pending massive assessments become unsaleable, creating a downward spiral that hurts everyone.</p>

            <h3>A Different Approach: Assessment Lien Financing</h3>
            <p>At TuCielo, we recognized that HOA financing requires a fundamentally different model. Here's what we've built:</p>

            <h4>Security That Makes Sense</h4>
            <p>Instead of personal guarantees, we secure loans with assessment lien rights—the association's legal ability to levy payments on unit owners. This creates predictable cash flow without personal risk to board members.</p>

            <h4>Crisis-Ready Underwriting</h4>
            <p>We evaluate factors that actually matter for HOA success:</p>
            <ul>
              <li>Community stability and engagement</li>
              <li>Long-term viability of the property</li>
              <li>Compliance readiness and planning</li>
              <li>Professional management quality</li>
            </ul>

            <h4>Realistic Terms</h4>
            <p>Our 25-year amortization schedules turn crushing special assessments into manageable monthly payments. A $20,000 per unit assessment becomes approximately $208 per month—the difference between displacement and stability.</p>

            <h3>What This Means for Industry Professionals</h3>

            <p><strong>Property Managers:</strong> You no longer have to choose between delivering bad news and losing management contracts. Assessment lien financing allows you to present solutions alongside problems, positioning yourself as the crisis-capable professional your communities need.</p>

            <p><strong>HOA Attorneys:</strong> Your clients facing compliance deadlines now have financing options that work within Florida's legal framework. You can advise on compliance strategies knowing that capital solutions exist.</p>

            <p><strong>Board Members:</strong> You can fulfill your fiduciary duty to maintain the property without personally guaranteeing loans or devastating your neighbors with impossible assessments.</p>

            <h3>The Path Forward</h3>
            <p>
              Florida's HOA financing crisis will only deepen as compliance deadlines approach and traditional banks continue their retreat. Communities need lenders who understand that post-Surfside regulations aren't risks to avoid—they're necessary investments in long-term viability.
            </p>
            <p>
              The choice facing HOA communities is stark: Find appropriate financing solutions or watch decades of community building disappear through forced displacement and property value destruction.
            </p>
            <p>
              At TuCielo, we're building the financing infrastructure that Florida HOAs need to navigate this crisis while preserving the communities that millions call home. Because every 78-year-old facing a $47,000 assessment deserves better than displacement from the home they've loved for decades.
            </p>
          </article>

          {/* COMMENTS SECTION */}
          <section className="comments-section">
            <h3>Leave a Comment</h3>
            <textarea
              placeholder="Write your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              
            />
            <button className="cta-button" onClick={handleSubmitComment}>
              Submit Comment
            </button>

            {/* Render existing comments */}
            <div style={{ marginTop: '20px' }}>
              {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
              {comments.map(({ id, text, userId: commentUserId }) => (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: '1px solid #ccc',
                    marginTop: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <span>{text}</span>
                  {commentUserId === userId && (
                    <button
                      onClick={() => handleDelete(id)}
                      style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                      }}
                      aria-label="Delete your comment"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* PAGINATION SECTION */}
          <div className="pagination-controls" style={{ marginTop: '40px' }}>
            <button disabled>← Newer Post</button>
            <button>Older Post →</button>
          </div>

          {/* BACK TO MAIN PAGE BUTTON */}
          <div className="back-to-main-container">
            <Link to="/" className="back-to-main-button">← Back to TuCielo</Link>
          </div>
        </div>
      </main>

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
};

export default BlogPosts;





