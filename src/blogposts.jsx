import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './blogposts.css';

const BlogPosts = () => {
  const posts = [
    {
      id: 1,
      title: 'How to Fund Your HOA Repairs Without Raising Dues',
      date: 'May 1, 2025',
      content:
        'In this article, we explore how HOAs can fund major capital improvement projects using innovative financing options, rather than relying on special assessments or increased dues...',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 2,
      title: 'Top 5 Mistakes HOAs Make When Budgeting for Repairs',
      date: 'April 24, 2025',
      content:
        'Budgeting mistakes can lead to underfunded reserves, special assessments, or delayed repairs. Learn the top 5 pitfalls and how to avoid them...',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 3,
      title: 'Understanding HOA Reserve Studies',
      date: 'April 10, 2025',
      content:
        'Reserve studies are a crucial tool for long-term financial planning. This guide helps you interpret, implement, and update them correctly...',
      image: 'https://via.placeholder.com/800x400',
    },
  ];

  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  const currentPost = posts[currentPostIndex];

  const handleNext = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
      setCommentsList([]);
    }
  };

  const handlePrevious = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
      setCommentsList([]);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setCommentsList([...commentsList, comment.trim()]);
      setComment('');
    }
  };

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
        <div className="blog-post-wrapper">
          <img src={currentPost.image} alt={currentPost.title} className="blog-full-image" />
          <h2 className="blog-post-title">{currentPost.title}</h2>
          <p className="blog-date">{currentPost.date}</p>
          <div className="blog-content">{currentPost.content}</div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="comments-section">
          <h3>Leave a Comment</h3>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-textarea"
              rows={4}
            />
            <button type="submit" className="cta-button">Submit</button>
          </form>
          <div className="comments-list">
            {commentsList.length > 0 && <h4>Comments:</h4>}
            {commentsList.map((c, idx) => (
              <p key={idx} className="comment">{c}</p>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={handlePrevious}
            disabled={currentPostIndex === 0}
          >
            ← Previous
          </button>
          <span>
            {currentPostIndex + 1} of {posts.length}
          </span>
          <button
            className="pagination-button"
            onClick={handleNext}
            disabled={currentPostIndex === posts.length - 1}
          >
            Next →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <p>© 2025 Tu Cielo. All rights reserved.</p>
        <br />
        <p>
          Disclaimer: TuCielo and any affiliated entities do not provide installation services and are not government agencies.
          All terms, conditions, and results are project-specific and may vary. Financing terms may change and are subject to TuCielo’s
          underwriting criteria without prior notice. Payment estimates are for budgeting purposes only and are based on total financed amounts.
          TuCielo financing is repaid through your HOA, and monthly payments may vary based on loan term, interest rate, fees, number of units,
          and other covenants agreed upon between the HOA and the lender. This website does not constitute an offer to lend. Please consult a
          TuCielo representative for personalized estimates.
        </p>
      </footer>
    </div>
  );
};

export default BlogPosts;

