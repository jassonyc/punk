// src/Gallery.js
import React, { useState, useRef, useEffect } from 'react';
import { mediaItems } from './data/mediaItems';
import './Gallery.css';

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [isStacked, setIsStacked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 800px), (orientation: portrait)').matches;
  });
  const mainRef = useRef(null);
  const touchStartX = useRef(null);

  // Watch for viewport changes to toggle stacked mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 800px), (orientation: portrait)');
    const onChange = () => setIsStacked(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // When stacked (mobile) mode is active enable body scrolling by adding a class
  useEffect(() => {
    const cls = 'allow-scroll';
    if (isStacked) {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
    } else {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    }
    return () => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    };
  }, [isStacked]);

  // Focus container so keyboard works (only when not stacked)
  useEffect(() => {
    const node = mainRef.current;
    if (node && !isStacked) node.focus();
  }, [isStacked]);

  // Wheel navigation (desktop) - skip in stacked mode
  useEffect(() => {
    if (isStacked) return;
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
  }, [isStacked]);

  // Tap for mobile advance and auto-random advance (only when not stacked)
  useEffect(() => {
    if (isStacked) return;
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
  }, [isStacked]);

  // Keyboard navigation and swipe handlers (skip in stacked)
  useEffect(() => {
    if (isStacked) return;
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
  }, [isStacked]);

  // Preload next image for smoother transitions (still useful)
  useEffect(() => {
    const next = (current + 1) % mediaItems.length;
    const img = new Image();
    img.src = mediaItems[next].url;
  }, [current]);

  if (isStacked) {
    // stacked vertical layout for phones: render all images in a vertical flow
    return (
      <div ref={mainRef} className="gallery-stack" aria-label="Galería en modo apilado">
        {mediaItems.map((m, i) => (
          <img key={i} className="stack-image" src={m.url} alt={m.alt || ''} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={mainRef}
      className="gallery-root"
      tabIndex={0}
      aria-roledescription="image gallery"
      aria-label={`Galería - imagen ${current + 1} de ${mediaItems.length}`}
    >
      <picture>
        {/* Responsive srcset using optimized variants (webp first, then jpeg). The optimizer creates -480/-800/-1200/-2000 variants. */}
        {(() => {
          const base = mediaItems[current].url.replace('/images/', '').replace(/\.[^.]+$/, '');
          const webpSet = `/images/optimized/${base}-480.webp 480w, /images/optimized/${base}-800.webp 800w, /images/optimized/${base}-1200.webp 1200w, /images/optimized/${base}-2000.webp 2000w`;
          const jpgSet = `/images/optimized/${base}-480.jpg 480w, /images/optimized/${base}-800.jpg 800w, /images/optimized/${base}-1200.jpg 1200w, /images/optimized/${base}-2000.jpg 2000w`;
          return (
            <>
              <source srcSet={webpSet} type="image/webp" />
              <source srcSet={jpgSet} type="image/jpeg" />
            </>
          );
        })()}
        <img
          className="gallery-image"
          src={mediaItems[current].url}
          srcSet={(() => {
            const base = mediaItems[current].url.replace('/images/', '').replace(/\.[^.]+$/, '');
            return `/images/optimized/${base}-800.jpg 800w, /images/optimized/${base}-1200.jpg 1200w, /images/optimized/${base}-2000.jpg 2000w`;
          })()}
          sizes="100vw"
          alt={mediaItems[current].alt || ''}
          draggable={false}
          loading={current === 0 ? 'eager' : 'lazy'}
          fetchPriority={current === 0 ? 'high' : 'auto'}
        />
      </picture>
    </div>
  );
}
