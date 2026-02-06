  import React, { useState, useRef, useEffect } from 'react';
import { mediaItems } from './data/mediaItems';
import './Gallery.css';

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const mainRef = useRef(null);
  const lastTapRef = useRef(Date.now());

  // Navegación con rueda del mouse (desktop)
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        setCurrent((prev) =>
          e.deltaY > 0
            ? (prev === mediaItems.length - 1 ? 0 : prev + 1)
            : (prev === 0 ? mediaItems.length - 1 : prev - 1)
        );
      }
    };

    const node = mainRef.current;
    if (node) node.addEventListener('wheel', handleWheel, { passive: false });

    return () => node && node.removeEventListener('wheel', handleWheel);
  }, []);

  // Tap móvil + avance automático
  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;

    const onTap = (e) => {
      if (e.touches && e.touches.length > 1) return;
      setCurrent((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      lastTapRef.current = Date.now();
    };

    node.addEventListener('touchend', onTap);

    const autoAdvance = setInterval(() => {
      if (
        mediaItems.length > 0 &&
        Date.now() - lastTapRef.current > 3000
      ) {
        setCurrent(Math.floor(Math.random() * mediaItems.length));
      }
    }, 3000);

    return () => {
      node.removeEventListener('touchend', onTap);
      clearInterval(autoAdvance);
    };
  }, []);

  return (
    <div ref={mainRef} className="gallery-container">
      <img
        src={mediaItems[current].url}
        alt=""
        draggable={false}
        className="gallery-image"
      />
    </div>
  );
}
