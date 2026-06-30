import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoCode,
    applyPromoCode,
    discount,
    total,
    clearCart
  } = useCart();

  // Promo code input state
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Address Details state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Payment Details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order Complete Modal state
  const [orderComplete, setOrderComplete] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  const handleApplyPromo = () => {
    setPromoError(false);
    setPromoSuccess(false);
    if (!promoInput.trim()) return;
    
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoSuccess(true);
      setPromoInput('');
    } else {
      setPromoError(true);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9]/g, '');
    if (clean.length > 2) {
      clean = `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    setCardExpiry(clean);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Simulate order placement
    const orderId = `AET-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(orderId);
    setOrderComplete(true);
  };

  const handleModalClose = () => {
    setOrderComplete(false);
    clearCart();
    // Reset forms
    setFullName('');
    setEmail('');
    setAddress('');
    setCity('');
    setZipCode('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="cart-page container">
        <div className="empty-cart-view glass-panel">
          <h3>Your Studio setup is empty.</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            No instruments or custom gears selected yet.
          </p>
          <Link to="/catalog" className="btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="gradient-text">Your Workspace Setup</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
        Review selected sound elements and complete custom checkout.
      </p>

      <div className="cart-layout">
        {/* Left Column: Cart items */}
        <div className="cart-items-panel glass-panel">
          {cart.map((item, i) => (
            <div className="cart-item-card" key={i}>
              <img
                src={item.product.image}
                alt={item.product.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product.name}</h3>
                
                <div className="cart-item-variants">
                  {Object.entries(item.selectedVariants).map(([name, val]) => (
                    <span className="variant-tag" key={name}>
                      {name}: <span>{val}</span>
                    </span>
                  ))}
                </div>

                <div className="cart-item-actions">
                  <div className="qty-selector" style={{ padding: '2px' }}>
                    <button
                      className="qty-btn"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => updateQuantity(item.product.id, item.selectedVariants, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      －
                    </button>
                    <span className="qty-value" style={{ width: '28px', fontSize: '13px' }}>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => updateQuantity(item.product.id, item.selectedVariants, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      ＋
                    </button>
                  </div>

                  <span className="cart-item-price">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout forms and summary */}
        <div className="checkout-panel glass-panel">
          <h3>Order Review</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row" style={{ color: 'var(--accent-copper)' }}>
              <span>Promo Discount ({promoCode})</span>
              <span>- ${discount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>Complementary</span>
          </div>

          <div className="summary-row summary-row-total">
            <span>Total Setup Cost</span>
            <span>${total.toLocaleString()}</span>
          </div>

          {/* Promo code */}
          <div className="promo-section">
            <input
              type="text"
              className="promo-input"
              placeholder="Promo Code (Try GOLDEN)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button className="promo-btn" onClick={handleApplyPromo}>Apply</button>
          </div>
          {promoError && (
            <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>
              Invalid discount credential.
            </p>
          )}
          {promoSuccess && (
            <p style={{ color: 'var(--color-success)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>
              Promo applied successfully!
            </p>
          )}

          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
            <div className="checkout-section-title">Shipping Address</div>
            
            <input
              type="text"
              className="promo-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              className="promo-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              className="promo-input"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="form-row">
              <input
                type="text"
                className="promo-input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                type="text"
                className="promo-input"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>

            <div className="checkout-section-title" style={{ marginTop: '16px' }}>Payment Card Details</div>

            {/* Visual Card widget */}
            <div className="card-widget">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-logo">AETHER PLATINUM</span>
                <span style={{ fontSize: '18px' }}>💳</span>
              </div>
              <div className="card-chip"></div>
              <div className="card-number-display">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="card-bottom-info">
                <div>
                  <span style={{ display: 'block', fontSize: '8px' }}>CARDHOLDER</span>
                  <span className="card-holder">{fullName || 'YOUR FULL NAME'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '8px' }}>EXPIRES</span>
                  <span className="card-expiry">{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            <input
              type="text"
              className="promo-input"
              placeholder="Card Number (16-digit)"
              maxLength={19}
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />

            <div className="form-row">
              <input
                type="text"
                className="promo-input"
                placeholder="Expiry (MM/YY)"
                maxLength={5}
                value={cardExpiry}
                onChange={handleExpiryChange}
                required
              />
              <input
                type="password"
                className="promo-input"
                placeholder="CVV"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Confirm Custom Order
            </button>
          </form>
        </div>
      </div>

      {/* Success Overlay Modal */}
      {orderComplete && (
        <div className="success-overlay">
          <div className="success-modal glass-panel-heavy">
            <div className="success-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3>Order Dispatched</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Thank you for choosing AETHER. Your artisan setup is being carefully boxed.
            </p>

            <div className="receipt-card">
              <div className="receipt-title">Order Receipt Summary</div>
              
              <div className="receipt-row">
                <span className="receipt-label">Order Reference:</span>
                <span className="receipt-val">{generatedOrderId}</span>
              </div>

              <div className="receipt-row">
                <span className="receipt-label">Custom Delivery:</span>
                <span className="receipt-val">{fullName}</span>
              </div>

              <div className="receipt-row">
                <span className="receipt-label">Shipping Destination:</span>
                <span className="receipt-val">{address}, {city}</span>
              </div>

              <div className="receipt-row" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px', marginTop: '8px' }}>
                <span className="receipt-label">Paid Via:</span>
                <span className="receipt-val">Card ending in {cardNumber.slice(-4)}</span>
              </div>

              <div className="receipt-row">
                <span className="receipt-label" style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>Paid Total:</span>
                <span className="receipt-val" style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>${total.toLocaleString()}</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handleModalClose}>
              Back to Showroom
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;
