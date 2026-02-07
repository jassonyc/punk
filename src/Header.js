// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // ← Importamos Link
import './Header.css';

export default function Header() {
  return (
    <header className="header" role="banner">
      <div className="left-group">
        <Link className="nav-btn shop-btn" to="/shop" aria-label="Tienda">Tienda</Link>
      </div>

      <Link to="/" className="logo" aria-label="Ir al inicio">JASSONYC</Link> {/* Título centrado y clicable */}

      <div className="right-group">
        <Link className="nav-btn contact-btn" to="/contact" aria-label="Contacto">Contacto</Link>
      </div>
    </header>
  );
}
