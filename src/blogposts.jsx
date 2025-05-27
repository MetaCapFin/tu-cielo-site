import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './blogposts.css';

const BlogPosts = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const posts = [
    {
      id: 1,
      title: 'How to Fund Your HOA Repairs Without Raising Dues',
      date: 'May 1, 2025',
      content: 'Learn how HOAs can finance major repairs without increasing assessments for residents...',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 2,
      title: 'Top 5 Mistakes HOAs Make When Budgeting for Repairs',
      date: 'April 24, 2025',
      content: 'Avoid these common financial pitfalls and keep your community’s finances on track...',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 3,
      title: 'Understanding HOA Reserve Studies',
      date: 'April 10, 2025',
      content: 'A simple guide to help your HOA board understand and use reserve studies effectively...',
      image: 'https://via.placeholder.com/800x400',
    },
  ];

  const currentPost = posts[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < posts.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="blog-page">
      {/* HEADER */}
      <header className="site-header">
        <div className="header-top">
          <div className="logo-title">
            <div className="logo-placeholder">
              <img src="/cloud_logo.jpg" alt="Logo" />
            </div>
            <h1>TuCielo</h1>
          </div>
          <div className="beta-label"><strong>Beta Program</strong></div>
        </div>
        <div className="header-bottom">
          <button className="header-button" onClick={() => setShowPrivacyModal(true)}>Privacy Policy</button>
          <Link to="/faq"><button className="header-button">FAQ</button></Link>
          <Link to="/blogposts"><button className="header-button">Blog</button></Link>
          <Link to="/contractor-proposal-tool"><button className="header-button">TuCielo Calculator</button></Link>
        </div>
      </header>

      <main className="main-content">
        <div className="blog-content-wrapper">
          <h2 className="blog-title">{currentPost.title}</h2>
          <p className="blog-date">{currentPost.date}</p>
          <img src={currentPost.image} alt={currentPost.title} className="blog-main-image" />
          <p className="blog-body">{currentPost.content}</p>

          <div className="comments-section">
            <h3>Leave a Comment</h3>
            <textarea placeholder="Your comment..." rows="4"></textarea>
            <button className="cta-button">Submit</button>
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={currentIndex === 0}>&laquo; Previous</button>
            <span>{currentIndex + 1} of {posts.length}</span>
            <button onClick={handleNext} disabled={currentIndex === posts.length - 1}>Next &raquo;</button>
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


