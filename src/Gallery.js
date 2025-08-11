  // ...existing code...


import React, { useState, useRef, useEffect } from 'react';
import { mediaItems } from './data/mediaItems';

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const mainRef = useRef(null);

  // Navegación con rueda del mouse (desktop)
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
        } else if (e.deltaY < 0) {
          setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
        }
      }
    };
    const node = mainRef.current;
    if (node) node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node && node.removeEventListener('wheel', handleWheel);
  }, []);

  // Navegación por tap (móvil) y avance aleatorio automático
  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;
    let lastTap = 0;
    let autoAdvance;

    // Tap para avanzar
    const onTap = (e) => {
      if (e.touches && e.touches.length > 1) return; // Ignorar multitouch
      setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      lastTap = Date.now();
    };
    node.addEventListener('touchend', onTap);

    // Avance aleatorio automático cada 12s si no hay interacción
    autoAdvance = setInterval(() => {
      if (Date.now() - lastTap > 11000) {
        setCurrent(() => Math.floor(Math.random() * mediaItems.length));
      }
    }, 12000);

    return () => {
      node.removeEventListener('touchend', onTap);
      clearInterval(autoAdvance);
    };
  }, []);

  return (
    <>
      <div
        ref={mainRef}
        style={{
          width: '100vw',
          height: '100vh',
          minHeight: 0,
          minWidth: 0,
          background: '#111',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          touchAction: 'pan-y',
        }}
        tabIndex={0}
      >
          {/* Enlace de contacto único */}
        {/* Título y enlace de contacto */}
        <div style={{
          position: 'absolute',
          top: 32,
          left: 0,
          width: '100%',
          textAlign: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: '2.7rem',
            color: '#fff',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px #000',
            lineHeight: 1.1,
            userSelect: 'none',
          }}>
            jassonyc
          </span>
        </div>
        <a
          href="/contacto"
          style={{
            position: 'absolute',
            top: 36,
            right: 36,
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#fff',
            letterSpacing: '0.08em',
            textDecoration: 'underline',
            background: 'rgba(0,0,0,0.18)',
            padding: '2px 10px',
            borderRadius: 6,
            zIndex: 3,
            pointerEvents: 'auto',
            userSelect: 'auto',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.38)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.18)'}
        >
          contacto
        </a>
        <img
          src={mediaItems[current].url}
          alt=""
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'center',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            display: 'block',
            margin: 0,
            background: 'transparent',
            boxShadow: 'none',
          }}
          draggable={false}
        />
      </div>
    </>
  );
}
