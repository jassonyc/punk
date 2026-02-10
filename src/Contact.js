// src/Contact.js
import React, { useState, useEffect } from 'react';
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
      const parsed = raw ? JSON.parse(raw) : [];
      // Trim helper to ensure we don't load oversized data
      const trimList = (list) => {
        const copy = Array.isArray(list) ? list.slice() : [];
        if (copy.length > MAX_COMMENTS) copy.length = MAX_COMMENTS;
        let total = copy.reduce((s, it) => s + (it.text || '').length, 0);
        while (total > MAX_TOTAL_CHARS && copy.length > 1) {
          const rem = copy.pop();
          total -= (rem.text || '').length;
        }
        return copy;
      };
      return trimList(parsed);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      // Persist current comments list to localStorage (no state mutation here)
      localStorage.setItem('comments', JSON.stringify(commentsList));
    } catch (e) {
      // ignore storage errors
    }
  }, [commentsList]);

  // No remote endpoint: comments are stored locally in the browser
  // If you later want remote delivery, re-add REACT_APP_COMMENT_ENDPOINT and the network logic.

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

  function handleSubmit() {
    const txt = comment.trim();
    if (!txt) {
      setStatus('Escribe algo antes de enviar.');
      setTimeout(() => setStatus(''), 2500);
      return;
    }

    setSubmitting(true);
    try {
      const commentObj = { text: txt, date: new Date().toISOString() };
      // Always persist locally
      persistComment(commentObj);
      setComment('');
      setStatus('Comentario guardado localmente.');
      // Clear status after a short delay
      setTimeout(() => setStatus(''), 3000);
    } finally {
      // ensure we always reset submitting state
      setSubmitting(false);
    }
  }

  function clearComments() {
    // use window.confirm to avoid ESLint "no-restricted-globals" rule
    if (!window.confirm('Borrar todos los comentarios locales? Esta acción no se puede deshacer.')) return;
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
          {/* Comments are stored locally in the browser. */}

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
