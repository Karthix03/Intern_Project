import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Philosophy = lazy(() => import('./pages/Philosophy'));

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Shimmer page skeleton for smooth loading transition
const SkeletonPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="shimmer" style={{ height: '48px', width: '30%', borderRadius: 'var(--border-radius-full)' }}></div>
      <div className="shimmer" style={{ height: '350px', width: '100%', borderRadius: 'var(--border-radius-lg)' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
        <div className="shimmer" style={{ height: '280px' }}></div>
        <div className="shimmer" style={{ height: '280px' }}></div>
        <div className="shimmer" style={{ height: '280px' }}></div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              <Suspense fallback={<SkeletonPage />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/philosophy" element={<Philosophy />} />
                  {/* Fallback redirect */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
