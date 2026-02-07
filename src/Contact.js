// src/Contact.js
import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-title">CONTACTO</div>
      <div className="contact-content">
        Serigrafía | Diseño | Fotografía<br/>
        Colectivo creativo<br/><br/>
        📧 <a href="mailto:jassonjfer9@gmail.com" className="contact-email">
          jassonjfer9@gmail.com
        </a>
      </div>
    </div>
  );
}
