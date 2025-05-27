import React from 'react';
import './blogposts.css';

const BlogPosts = () => {
  const posts = [
    {
      id: 1,
      title: 'How to Fund Your HOA Repairs Without Raising Dues',
      date: 'May 1, 2025',
      excerpt: 'Learn how HOAs can finance major repairs without increasing assessments for residents...',
      image: 'https://via.placeholder.com/600x300',
    },
    {
      id: 2,
      title: 'Top 5 Mistakes HOAs Make When Budgeting for Repairs',
      date: 'April 24, 2025',
      excerpt: 'Avoid these common financial pitfalls and keep your community’s finances on track...',
      image: 'https://via.placeholder.com/600x300',
    },
    {
      id: 3,
      title: 'Understanding HOA Reserve Studies',
      date: 'April 10, 2025',
      excerpt: 'A simple guide to help your HOA board understand and use reserve studies effectively...',
      image: 'https://via.placeholder.com/600x300',
    },
  ];

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="content-wrapper blog-section">
          <h2 className="blog-title">Latest Blog Posts</h2>
          <div className="blog-grid">
            {posts.map((post) => (
              <div className="blog-card" key={post.id}>
                <img src={post.image} alt={post.title} className="blog-image" />
                <div className="blog-card-content">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-date">{post.date}</p>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button className="cta-button">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPosts;
