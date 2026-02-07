// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // ← Importamos Link
import './Header.css';

export default function Header() {
  return (
    <header className="header" role="banner">
      <Link to="/" className="logo" aria-label="Ir al inicio">jassonyc</Link> {/* Título centrado y clicable */}
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <Link className="shop-btn" to="/shop" aria-label="Tienda">Tienda</Link>
        <a className="xml-btn" href="/tiendacata.xml" target="_blank" rel="noopener noreferrer" aria-label="Descargar XML">XML</a>
        <Link className="contact-btn" to="/contact" aria-label="Contacto">Contacto</Link>
      </div>
    </header>
  );
}
