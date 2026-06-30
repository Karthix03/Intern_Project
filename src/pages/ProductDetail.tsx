import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import type { Product, Review } from '../types';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      // Initialize variant selectors
      const initialVariants: Record<string, string> = {};
      foundProduct.variants.forEach(variant => {
        initialVariants[variant.name] = variant.values[0];
      });
      setSelectedVariants(initialVariants);
      setQuantity(1);
    } else {
      navigate('/catalog');
    }
  }, [id, products, navigate]);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '120px', textAlign: 'center' }}>
        <div className="shimmer" style={{ height: '400px', width: '100%' }}></div>
      </div>
    );
  }

  const handleVariantSelect = (groupName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupName]: value
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      author: reviewerName,
      comment: reviewComment,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0]
    };

    // Update local product reviews
    const updatedReviews = [newReview, ...product.reviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = Math.round((totalRating / updatedReviews.length) * 10) / 10;

    setProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviews: updatedReviews,
        reviewsCount: updatedReviews.length,
        rating: newAverage
      };
    });

    // Reset Review fields
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="detail-page container">
      <Link to="/catalog" className="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to laboratory
      </Link>

      <div className="detail-grid">
        {/* Left Column: Image & specs */}
        <div className="gallery-container">
          <div className="main-image-wrapper">
            <img src={product.image} alt={product.name} className="main-image" />
          </div>

          <div className="specs-section glass-panel">
            <h3>Technical Specifications</h3>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([name, val]) => (
                  <tr key={name}>
                    <td className="spec-name">{name}</td>
                    <td className="spec-value">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Descriptions & variant selects */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-tagline">{product.tagline}</p>
          
          <div className="rating-summary">
            <div className="detail-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <a href="#reviews" className="review-link">
              {product.reviewsCount} customer review{product.reviewsCount !== 1 ? 's' : ''}
            </a>
          </div>

          <div className="detail-price">${product.price.toLocaleString()}</div>
          
          <p className="detail-desc">{product.description}</p>

          <div className="variants-container">
            {product.variants.map((vGroup) => (
              <div className="variant-group" key={vGroup.name}>
                <span className="variant-label">{vGroup.name}</span>
                <div className="variant-buttons">
                  {vGroup.values.map((vVal) => (
                    <button
                      key={vVal}
                      className={`variant-btn ${selectedVariants[vGroup.name] === vVal ? 'variant-btn-active' : ''}`}
                      onClick={() => handleVariantSelect(vGroup.name, vVal)}
                    >
                      {vVal}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="buy-actions">
            <div className="qty-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                －
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                ＋
              </button>
            </div>

            <button className="btn-primary" onClick={handleAddToCart}>
              Add to Soundstage
            </button>
          </div>

          {addedMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1.5px solid var(--color-success)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-success)',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '16px',
              animation: 'loading-shimmer 2s infinite'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Added to your workspace setup!</span>
            </div>
          )}

          <div className="detail-features">
            {product.features.map((feat) => (
              <div className="feat-item" key={feat}>
                <span className="feat-dot"></span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section">
        <div className="reviews-header">
          <h3>Customer Feedback</h3>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Average: {product.rating} / 5.0
          </span>
        </div>

        <div className="reviews-grid">
          {/* Reviews List */}
          <div className="reviews-list">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div className="review-item" key={rev.id}>
                  <div className="review-meta">
                    <span className="review-author">{rev.author}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts.</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="review-form-card glass-panel">
            <h4>Leave a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <span className="form-label">Your Rating</span>
                <div className="star-rating-selector" onMouseLeave={() => setHoverRating(null)}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        className={`star-select-btn ${(hoverRating !== null ? hoverRating : reviewRating) >= ratingValue ? 'star-select-btn-active' : ''}`}
                        onClick={() => setReviewRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        aria-label={`Rate ${ratingValue} stars`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={(hoverRating !== null ? hoverRating : reviewRating) >= ratingValue ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reviewerName">Your Name</label>
                <input
                  type="text"
                  id="reviewerName"
                  className="form-input"
                  placeholder="e.g. Samuel G."
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reviewComment">Your Feedback</label>
                <textarea
                  id="reviewComment"
                  className="form-input"
                  rows={4}
                  placeholder="Describe your acoustic experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Publish Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProductDetail;
