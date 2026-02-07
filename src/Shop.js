// src/Shop.js
import React from 'react';
import './Shop.css';
import { tiendaItems } from './data/tiendaItems';

const fallback = [
	{
		id: 'shirt-001',
		title: 'Jassonyc Tee',
		price: '25 USD',
		desc: 'Camiseta serigrafiada — color: negro. Tallas S–XXL.',
		buy: 'mailto:jassonjfer9@gmail.com?subject=Pedido%20Jassonyc%20Tee&body=Hola%2C%20quiero%20pedir%20una%20Jassonyc%20Tee.%20Talla%3A%20%0AColor%3A%20%0ADireccion%3A%20',
	},
];

export default function Shop() {
	const items = Array.isArray(tiendaItems) && tiendaItems.length ? tiendaItems : fallback;
	return (
		<main className="shop-page" role="main">
			<div className="shop-inner">
				<h1>Tienda</h1>
				<p className="shop-sub">Pedidos por email — contenido importado desde WordPress.</p>
				<div className="products">
					{items.map((p, idx) => (
						<article key={p.id || idx} className="product">
							<div className="product-thumb" aria-hidden="true"></div>
							<div className="product-body">
								<h2>{p.title}</h2>
								{p.price && <div className="price">{p.price}</div>}
								<p className="desc" dangerouslySetInnerHTML={{ __html: p.content || p.desc || '' }} />
								<a
									className="buy-btn"
									href={`mailto:jassonjfer9@gmail.com?subject=Pedido%20${encodeURIComponent(p.title || 'Producto')}&body=Hola%2C%20quiero%20pedir%20este%20producto.%20${encodeURIComponent(p.title || '')}%20%0ATalla%3A%20%0AColor%3A%20%0ADireccion%3A%20`}
								>
									Pedir
								</a>
							</div>
						</article>
					))}
				</div>
			</div>
		</main>
	);
}
