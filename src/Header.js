// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // ← Importamos Link
import './Header.css';

export default function Header() {
  return (
    <header className="header" role="banner">
      <div className="logo">jassonyc</div> {/* Título centrado */}
      <Link className="contact-btn" to="/contact" aria-label="Contacto">Contacto</Link>
    </header>
  );
}
