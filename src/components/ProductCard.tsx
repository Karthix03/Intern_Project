import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card glass-panel hover-lift" style={{ padding: '20px' }}>
      {product.featured && <span className="product-tag">Artisan Pick</span>}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>
        <div className="product-meta">
          <span className="product-price">${product.price.toLocaleString()}</span>
          <div className="product-rating">
            <svg
              className="star-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
