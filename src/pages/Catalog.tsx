import React from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import './Catalog.css';

export const Catalog: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    filteredProducts
  } = useProducts();

  // Helper to count products in a category
  const getCategoryCount = (category: string) => {
    if (category === 'all') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1500]);
    setSortBy('featured');
  };

  return (
    <div className="catalog-page container">
      <div className="catalog-header">
        <h1 className="gradient-text">The Sound Laboratory</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Explore our range of precision audio instruments and bespoke workspace tools.
        </p>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass-panel">
          {/* Categories */}
          <div className="filter-section">
            <h3 className="filter-title">Categories</h3>
            <div className="category-list">
              {(['all', 'headphones', 'amplifiers', 'keyboards', 'turntables'] as const).map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'category-btn-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span style={{ textTransform: 'capitalize' }}>
                    {cat === 'all' ? 'All Instruments' : cat}
                  </span>
                  <span className="category-count">{getCategoryCount(cat)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3 className="filter-title">Filter by Price</h3>
            <div className="price-slider-container">
              <input
                type="range"
                className="price-slider"
                min="0"
                max="1500"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                aria-label="Max Price Filter"
              />
              <div className="price-inputs">
                <span>Min: ${priceRange[0]}</span>
                <span>Max: ${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Reset Filters
          </button>
        </aside>

        {/* Main Catalog View */}
        <main className="catalog-content">
          <div className="catalog-header-bar">
            <div className="results-count">
              Showing <span>{filteredProducts.length}</span> instruments
            </div>

            <div className="catalog-controls">
              {/* Search Bar */}
              <div className="search-wrapper">
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort By */}
              <div className="sort-select-wrapper">
                <span>Sort:</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-catalog glass-panel">
              <svg
                className="empty-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <h3>No Instruments Found</h3>
              <p>Try clearing filters or adjusting your search term.</p>
              <button
                className="btn-primary"
                style={{ marginTop: '24px' }}
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Catalog;
