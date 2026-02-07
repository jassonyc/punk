// src/Shop.js
import React from 'react';
import './Shop.css';

const products = [
  {
    id: 'shirt-001',
    title: 'Jassonyc Tee',
    price: '25 USD',
    desc: 'Camiseta serigrafiada — color: negro. Tallas S–XXL.',
    buy: 'mailto:jassonjfer9@gmail.com?subject=Pedido%20Jassonyc%20Tee&body=Hola%2C%20quiero%20pedir%20una%20Jassonyc%20Tee.%20Talla%3A%20%0AColor%3A%20%0ADireccion%3A%20'
  },
  {
    id: 'jacket-001',
    title: 'Overshirt Jacket',
    price: '60 USD',
    desc: 'Chaqueta ligera serigrafiada. Tallas S–XXL.',
    buy: 'mailto:jassonjfer9@gmail.com?subject=Pedido%20Overshirt%20Jassonyc&body=Hola%2C%20quiero%20pedir%20una%20Overshirt.%20Talla%3A%20%0AColor%3A%20%0ADireccion%3A%20'
  }
];

export default function Shop() {
  return (
    <main className="shop-page" role="main">
      <div className="shop-inner">
        <h1>Tienda</h1>
        <p className="shop-sub">Camisetas y Jackets — serigrafía propia. Pedido por email.</p>
        <div className="products">
          {products.map(p => (
            <article key={p.id} className="product">
              <div className="product-thumb" aria-hidden="true"></div>
              <div className="product-body">
                <h2>{p.title}</h2>
                <div className="price">{p.price}</div>
                <p className="desc">{p.desc}</p>
                <a className="buy-btn" href={p.buy}>Pedir</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
