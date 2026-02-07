// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './Gallery';
import Header from './Header';
import Contact from './Contact'; // ← Este será tu componente de contacto
import Shop from './Shop';

function App() {
  return (
    <Router>
      <Header /> {/* Siempre visible */}
      <Routes>
        <Route path="/" element={<Gallery />} /> {/* Página principal */}
        <Route path="/contact" element={<Contact />} /> {/* Página de contacto */}
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
