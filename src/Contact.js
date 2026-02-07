// src/Contact.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [comment, setComment] = useState('');

  function handleSubmit() {
    const txt = comment.trim();
    if (!txt) return alert('Escribe algo antes de enviar.');
    alert('Gracias por tu comentario — (anónimo)');
    setComment('');
  }

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

        {/* Anonymous comment box */}
        <div className="contact-comments" aria-labelledby="comentarios-title">
          <h2 id="comentarios-title" style={{marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '1.05rem'}}>Deja un comentario anónimo</h2>
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu opinión rápidamente... (anónimo)"
            aria-label="Comentario anónimo"
          />
          <div className="comment-controls">
            <button type="button" className="comment-btn" onClick={handleSubmit}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
