// src/Gallery.js
import React, { useState, useRef, useEffect } from 'react';
import { mediaItems } from './data/mediaItems';
import './Gallery.css';

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const mainRef = useRef(null);
  const touchStartX = useRef(null);

  // Focus container so keyboard works
  useEffect(() => {
    const node = mainRef.current;
    if (node) node.focus();
  }, []);

  // Wheel navigation (desktop)
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

  // Tap for mobile advance and auto-random advance
  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;
    let lastTap = 0;
    let autoAdvance;

    const onTap = (e) => {
      if (e.touches && e.touches.length > 1) return; // ignore multitouch
      setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      lastTap = Date.now();
    };

    node.addEventListener('touchend', onTap);

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

  // Keyboard navigation and swipe handlers
  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;

    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      } else if (e.key === 'Home') {
        setCurrent(0);
      } else if (e.key === 'End') {
        setCurrent(mediaItems.length - 1);
      }
    };

    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
      if (touchStartX.current == null) return;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - touchStartX.current;
      const threshold = 50; // swipe threshold
      if (dx > threshold) {
        // swipe right -> prev
        setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      } else if (dx < -threshold) {
        // swipe left -> next
        setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      }
      touchStartX.current = null;
    };

    node.addEventListener('keydown', onKey);
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchend', onTouchEnd);

    return () => {
      node.removeEventListener('keydown', onKey);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Preload next image for smoother transitions
  useEffect(() => {
    const next = (current + 1) % mediaItems.length;
    const img = new Image();
    img.src = mediaItems[next].url;
  }, [current]);

  return (
    <div
      ref={mainRef}
      className="gallery-root"
      tabIndex={0}
      aria-roledescription="image gallery"
      aria-label={`Galería - imagen ${current + 1} de ${mediaItems.length}`}
    >
      {/* Gallery: only the fullscreen image. Header provides site navigation. */}
      <img
        className="gallery-image"
        src={mediaItems[current].url}
        alt={mediaItems[current].alt || ''}
        draggable={false}
        loading={current === 0 ? 'eager' : 'lazy'}
        fetchPriority={current === 0 ? 'high' : 'auto'}
      />
    </div>
  );
}
