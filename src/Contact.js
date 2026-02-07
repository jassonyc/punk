// src/Contact.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const MAX_COMMENTS = 30; // keep last 30 comments
  const MAX_TOTAL_CHARS = 40000; // roughly limit total chars stored

  const [commentsList, setCommentsList] = useState(() => {
    try {
      const raw = localStorage.getItem('comments');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      // Trim if necessary before storing
      let list = Array.isArray(commentsList) ? commentsList.slice() : [];
      // enforce max count
      if (list.length > MAX_COMMENTS) list = list.slice(0, MAX_COMMENTS);
      // enforce total chars
      let total = list.reduce((s, it) => s + (it.text || '').length, 0);
      while (total > MAX_TOTAL_CHARS && list.length > 1) {
        const removed = list.pop();
        total -= (removed.text || '').length;
      }
      localStorage.setItem('comments', JSON.stringify(list));
      // sync state if trimmed
      if (list.length !== commentsList.length) setCommentsList(list);
    } catch (e) {
      // ignore storage errors
    }
  }, [commentsList]);

  const endpoint = process.env.REACT_APP_COMMENT_ENDPOINT || ''; // set this to your Formspree or webhook URL

  function persistComment(commentObj) {
    setCommentsList((prev) => {
      const next = [commentObj, ...prev];
      // Trim to max count immediately
      if (next.length > MAX_COMMENTS) next.length = MAX_COMMENTS;
      // Also trim total chars if somehow exceeded
      let total = next.reduce((s, it) => s + (it.text || '').length, 0);
      while (total > MAX_TOTAL_CHARS && next.length > 1) {
        const rem = next.pop();
        total -= (rem.text || '').length;
      }
      return next;
    });
  }

  async function handleSubmit() {
    const txt = comment.trim();
    if (!txt) return alert('Escribe algo antes de enviar.');

    const commentObj = { text: txt, date: new Date().toISOString() };

    if (!endpoint) {
      // No endpoint configured: local fallback and persist
      persistComment(commentObj);
      alert('Gracias por tu comentario — (anónimo)');
      setComment('');
      return;
    }

    try {
      setSubmitting(true);
      setStatus('');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: txt }),
      });
      if (res.ok) {
        setStatus('Gracias — tu comentario fue enviado.');
        persistComment(commentObj);
        setComment('');
      } else {
        const text = await res.text();
        setStatus('Error enviando comentario');
        console.error('Comment submit error:', res.status, text);
      }
    } catch (err) {
      setStatus('Error de red al enviar comentario');
      console.error('Comment submit exception:', err);
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(''), 4500);
    }
  }

  function clearComments() {
    if (!confirm('Borrar todos los comentarios locales? Esta acción no se puede deshacer.')) return;
    try {
      localStorage.removeItem('comments');
    } catch (e) {}
    setCommentsList([]);
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
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 id="comentarios-title" style={{marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '1.05rem'}}>Deja un comentario anónimo</h2>
            <div style={{display:'flex',gap:10}}>
              <button className="comment-clear" type="button" onClick={clearComments}>Borrar todos</button>
              <div style={{fontSize:12,opacity:0.9}}>Guardados: {commentsList.length}</div>
            </div>
          </div>

          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu opinión rápidamente... (anónimo)"
            aria-label="Comentario anónimo"
            disabled={submitting}
          />
          <div className="comment-controls">
            <button type="button" className="comment-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
          {status && <div style={{marginTop:8,fontSize:14,color:'#fff',opacity:0.9}}>{status}</div>}
          {!endpoint && (
            <div style={{marginTop:8,fontSize:12,color:'#ccc'}}>Para recibir mensajes reales configura REACT_APP_COMMENT_ENDPOINT (Formspree o webhook).</div>
          )}

          {/* Persisted comments list */}
          {commentsList && commentsList.length > 0 && (
            <div className="comment-list" aria-live="polite">
              {commentsList.map((c, i) => (
                <div key={i} className="comment-item">
                  <div style={{opacity:0.85,fontSize:12,marginBottom:6}}>{new Date(c.date).toLocaleString()}</div>
                  <div>{c.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
