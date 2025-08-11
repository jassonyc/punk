

import React, { useRef, useEffect, useState } from 'react';
import { mediaItems } from './data/mediaItems';
import './App.css';

function App() {
  const [current, setCurrent] = useState(0);
  const mainRef = useRef(null);

  // Scroll vertical para cambiar de foto grande
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          setCurrent((prev) => (prev === mediaItems.length - 1 ? prev : prev + 1));
        } else if (e.deltaY < 0) {
          setCurrent((prev) => (prev === 0 ? 0 : prev - 1));
        }
      }
    };
    const node = mainRef.current;
    if (node) node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node && node.removeEventListener('wheel', handleWheel);
  }, []);

  // Scroll horizontal para miniaturas
  const thumbRef = useRef(null);
  useEffect(() => {
    const node = thumbRef.current;
    if (!node) return;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        node.scrollLeft += e.deltaX;
        e.preventDefault();
      }
    };
    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#1a0e06' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '3rem', color: '#fff', marginBottom: '2.5rem', letterSpacing: '2px' }}>
        Gallery
      </h1>
      <div ref={mainRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '70vh', outline: 'none' }} tabIndex={0}>
        <div style={{ maxWidth: '98vw', maxHeight: '88vh', width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          {mediaItems[current].type === 'photo' ? (
            <img src={mediaItems[current].url} alt={mediaItems[current].title} style={{ width: 'auto', height: '85vh', maxWidth: '98vw', objectFit: 'contain', background: '#fff', borderRadius: 0, boxShadow: '0 6px 36px rgba(0,0,0,0.13)', border: '4px solid #2d1407' }} />
          ) : (
            <video controls style={{ width: 'auto', height: '85vh', maxWidth: '98vw', objectFit: 'contain', background: '#fff', borderRadius: 0, boxShadow: '0 6px 36px rgba(0,0,0,0.13)', border: '4px solid #2d1407' }}>
              <source src={mediaItems[current].url} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          )}
        </div>
        <div ref={thumbRef} style={{ display: 'flex', overflowX: 'auto', gap: 16, padding: 8, maxWidth: '98vw', borderRadius: 0, background: '#3e1f0d', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          {mediaItems.map((item, idx) => (
            <img
              key={item.id}
              src={item.url}
              alt={item.title}
              onClick={() => setCurrent(idx)}
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 0,
                border: idx === current ? '4px solid #2d1407' : '2px solid #a97c50',
                cursor: 'pointer',
                opacity: idx === current ? 1 : 0.7,
                transition: 'border 0.2s, opacity 0.2s',
                background: '#fff',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 16, color: '#444', fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>
          {mediaItems[current].title}
        </div>
      </div>
    </div>
  );
}

export default App;
