// src/Shop.js
import React, { useState, useEffect } from 'react';
import './Shop.css';
import IMAGES from './data/shopImages.json';

// Helpers to resolve local optimized images
function srcFor(id, size = 1024) {
  const m = IMAGES[id];
  if (!m) return null;
  const webp = m[`webp${size}`];
  const jpg = m[`jpg${size}`];
  return webp || jpg || m.thumb || null;
}
function thumbFor(id) {
  const m = IMAGES[id];
  return m?.thumb || null;
}

// Editable product list (front/back pairs). Generate one product per image in the mapping, default price 60
const PRODUCTS = Object.keys(IMAGES).sort().map((imgId, idx) => ({
  id: `prod-${idx + 1}`,
  title: `Item ${idx + 1}`,
  priceNumber: 60,
  frontId: imgId,
  backId: imgId,
}));

function currency(n) { return `USD ${n}`; }

// Effective price logic: default 60, but any product whose title contains "tshith" costs 30
function effectivePrice(product) {
  if (!product) return 60;
  if (/tshith/i.test(product.title || '')) return 30;
  return product.priceNumber ?? 60;
}

export default function Shop() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop_cart')) || []; } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('shop_cart', JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  // Allow the page to scroll while this Shop component is mounted.
  useEffect(() => {
    try {
      document.documentElement.classList.add('allow-scroll');
      document.body.classList.add('allow-scroll');
    } catch (e) {}
    return () => {
      try {
        document.documentElement.classList.remove('allow-scroll');
        document.body.classList.remove('allow-scroll');
      } catch (e) {}
    };
  }, []);

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      return [...prev, { id: product.id, title: product.title, priceNumber: effectivePrice(product), qty }];
    });
    setShowCart(true);
  }

  function updateQty(id, qty) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(0, qty) } : p).filter(p => p.qty > 0));
  }

  function removeFromCart(id) { setCart(prev => prev.filter(p => p.id !== id)); }

  function computeTotal() { return cart.reduce((s, it) => s + (it.priceNumber || 0) * (it.qty || 0), 0); }

  function checkoutByEmail() {
    if (cart.length === 0) return;
    const lines = cart.map(it => `${it.qty} × ${it.title} — ${currency(it.priceNumber)}`);
    lines.push(''); lines.push(`Total: ${currency(computeTotal())}`);
    const mail = `mailto:jassonjfer9@gmail.com?subject=Pedido&body=${encodeURIComponent(lines.join('\n'))}`;
    window.location.href = mail;
  }

  return (
    <main className="shop-root">
      <header className="shop-hero" style={{ backgroundImage: `url('${srcFor(PRODUCTS[0].backId, 1024) || '/images/shop/c-01-after-1024.jpg'}')` }}>
        <div className="shop-hero__inner" aria-hidden="true" />
      </header>

      <section className="shop-grid">
        {PRODUCTS.map(prod => {
          // show the back image as the main photo, front as the secondary
          const mainImg = srcFor(prod.backId, 1024) || srcFor(prod.backId, 480);
          const altImg = srcFor(prod.frontId, 1024) || srcFor(prod.frontId, 480);
          const thumbMain = thumbFor(prod.backId) || mainImg;
          const thumbAlt = thumbFor(prod.frontId) || altImg;
          return (
            <article key={prod.id} className="card">
              <div className="card-media">
                <img src={mainImg} alt={`${prod.title}`} className="card-media__main"/>
              </div>
              <div className="card-info">
                <div className="card-title">{prod.title}</div>
                <div className="card-price">{currency(effectivePrice(prod))}</div>
                <div className="card-actions">
                  <button className="shop-btn shop-btn--small" onClick={() => addToCart(prod)}>Agregar</button>
                </div>
                {/* thumbs removed: only one image per product */}
              </div>
            </article>
          );
        })}
      </section>

      {/* Cart drawer */}
      <aside className={`shop-cart ${showCart ? 'shop-cart--open' : ''}`} aria-hidden={!showCart}>
        <div className="shop-cart__head">
          <strong>Carrito</strong>
          <button className="shop-cart__close" onClick={() => setShowCart(false)}>Cerrar</button>
        </div>
        <div className="shop-cart__items">
          {cart.length === 0 && <div className="shop-cart__empty">Tu carrito está vacío</div>}
          {cart.map(it => (
            <div className="cart-row" key={it.id}>
              <div className="cart-row__meta">
                <div className="cart-row__title">{it.title}</div>
                <div className="cart-row__price">{currency(it.priceNumber)}</div>
              </div>
              <div className="cart-row__actions">
                <button onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                <div className="cart-row__qty">{it.qty}</div>
                <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                <button className="cart-row__remove" onClick={() => removeFromCart(it.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="shop-cart__foot">
          <div>Total: <strong>{currency(computeTotal())}</strong></div>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="shop-btn" onClick={checkoutByEmail} disabled={cart.length===0}>Enviar pedido por email</button>
            <button className="shop-btn shop-btn--ghost" onClick={() => setCart([])} disabled={cart.length===0}>Vaciar</button>
          </div>
        </div>
      </aside>
    </main>
  );
}
