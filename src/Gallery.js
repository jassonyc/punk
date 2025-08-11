
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

  // Navegación por swipe (móvil)
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isTouch = false;
    const node = mainRef.current;
    if (!node) return;
    const onTouchStart = (e) => {
      isTouch = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (!isTouch) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
        else setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
        if (dy > 0) setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
        else setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      }
      isTouch = false;
    };
    node.addEventListener('touchstart', onTouchStart);
    node.addEventListener('touchend', onTouchEnd);
    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={mainRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'pan-y',
      }}
      tabIndex={0}
    >
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
          fontFamily: 'Georgia, serif',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          color: '#fff',
          letterSpacing: '0.2em',
          background: 'rgba(0,0,0,0.18)',
          padding: '0.2em 1.2em',
          borderRadius: 12,
          textTransform: 'uppercase',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}>
          GALLERY
        </span>
      </div>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          background: '#000',
        }}
      >
        <img
          src={mediaItems[current].url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            objectFit: 'contain',
            objectPosition: 'center',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)',
            display: 'block',
            margin: 'auto',
            background: '#000',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
