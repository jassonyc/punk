// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';

// Lazy-load route components to reduce initial bundle size
const Gallery = React.lazy(() => import('./Gallery'));
const Shop = React.lazy(() => import('./Shop'));
const Contact = React.lazy(() => import('./Contact'));

function App() {
  return (
    <Router>
      <Header /> {/* Siempre visible */}
      <Suspense fallback={<div style={{padding:20}}>Cargando…</div>}>
        <Routes>
          <Route path="/" element={<Gallery />} /> {/* Página principal */}
          <Route path="/contact" element={<Contact />} /> {/* Página de contacto */}
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
