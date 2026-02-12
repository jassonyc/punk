// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header" role="banner">
      <div className="left-group">
        <Link to="/" className="logo" aria-label="Ir al inicio">CATAZHO HARDCORE</Link>
      </div>

      <nav className="center-nav" aria-label="Main navigation">
        <Link className="nav-btn" to="/shop">Shop</Link>
        <Link className="nav-btn" to="/about">About</Link>
        <Link className="nav-btn" to="/contact">Contact</Link>
      </nav>

      <div className="right-group">
        <Link className="nav-cart" to="/shop" aria-label="Carrito">🛒</Link>
      </div>
    </header>
  );
}
