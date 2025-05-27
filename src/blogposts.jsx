import React, { useState } from 'react';
import './blogposts.css';
import { Link } from 'react-router-dom';

const BlogPosts = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="page-container">
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
          <Link to="/faq">
            <button className="header-button">FAQ</button>
          </Link>
          <Link to="/blogposts">
            <button className="header-button">Blog</button>
          </Link>
          <Link to="/contractor-proposal-tool">
            <button className="header-button">TuCielo Calculator</button>
          </Link>
        </div>
      </header>

      {/* MAIN BLOG POST */}
      <main className="main-content">
        <div className="content-wrapper blog-section">
          <h2 className="blog-title">The Florida HOA Financing Crisis: Why Traditional Banks Are Failing Communities</h2>
          <article className="blog-article">
            <p><em>As the founder of TuCielo, I've spent months analyzing the unprecedented challenges facing Florida's condominium communities...</em></p>

            <h3>The Numbers Tell a Devastating Story</h3>
            <ul>
              <li><strong>Skyrocketing Costs:</strong> HOA fees rose from $232 to $390/month in 3 years; Miami at $835/month.</li>
              <li><strong>Assessment Shock:</strong> $500–$400,000 per unit; repairs cost $15K–$75K per unit.</li>
              <li><strong>Market Displacement:</strong> 22% value drop for 30+ year-old buildings; 1,400+ blacklisted by Fannie Mae.</li>
            </ul>

            <h3>The Post-Surfside Regulatory Reality</h3>
            <p>Milestone inspections, reserve studies, and full reserve funding have triggered an immediate financial reckoning...</p>

            <h3>Why Traditional Banks Are Retreating</h3>
            <ul>
              <li><strong>Risk Model Mismatch:</strong> Banks demand personal guarantees and short terms.</li>
              <li><strong>Compliance Cost Confusion:</strong> Banks misclassify regulations as risk.</li>
              <li><strong>Operational Inflexibility:</strong> Long approval timelines, inflexible processes.</li>
            </ul>

            <h3>The Hidden Cost of Inaction</h3>
            <p>Special assessments are forcing displacement and property value destruction...</p>

            <h3>A Different Approach: Assessment Lien Financing</h3>
            <ul>
              <li><strong>Security That Makes Sense:</strong> No personal guarantees; secured by assessment liens.</li>
              <li><strong>Crisis-Ready Underwriting:</strong> Evaluates true community viability.</li>
              <li><strong>Realistic Terms:</strong> Turns $20K assessments into ~$208/month payments.</li>
            </ul>

            <h3>What This Means for Industry Professionals</h3>
            <p><strong>Property Managers:</strong> Provide solutions, not just problems.<br />
              <strong>HOA Attorneys:</strong> Advise clients with confidence.<br />
              <strong>Board Members:</strong> Fulfill fiduciary duty without harming neighbors.
            </p>

            <h3>The Path Forward</h3>
            <p>TuCielo is creating the financing infrastructure Florida communities need. Because no senior should be displaced by a $47,000 bill.</p>
          </article>

          {/* COMMENT SECTION */}
          <section className="comment-section">
            <h3>Leave a Comment</h3>
            <textarea placeholder="Write your comment here..." className="comment-box" />
            <button className="cta-button">Submit Comment</button>
          </section>

          {/* PAGINATION SECTION */}
          <div className="pagination">
            <button className="pagination-button" disabled>← Newer Post</button>
            <button className="pagination-button">Older Post →</button>
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
          notice. Payment estimates are for budgeting purposes only and are based on total financed amounts...
        </p>
      </footer>
    </div>
  );
};

export default BlogPosts;




