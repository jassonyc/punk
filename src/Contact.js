// src/Contact.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  return (
    <div
      className="contact-page"
      role="main"
      style={{
        backgroundImage: "url('/images/_DSC0042.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background image fallback (ensures image loads even if CSS background fails) */}
      <img className="contact-bg" src="/images/_DSC0042.jpg" alt="Workshop press" />

      {/* Home links: react-router Link and plain anchor for static pages */}
      <Link to="/" className="contact-home" aria-label="Volver al inicio">jassonyc</Link>
      <a href="/" className="contact-home plain" aria-label="Volver al inicio (estático)">inicio</a>

      <div className="contact-panel">
        <h1 className="contact-title">CONTACTO</h1>
        <div className="contact-sub">Serigrafía | Diseño | Fotografía<br/>Colectivo creativo</div>
        <a className="contact-email" href="mailto:jassonjfer9@gmail.com">📧 jassonjfer9@gmail.com</a>
      </div>
    </div>
  );
}
