// src/Shop.js
import React, { useState } from 'react';
import './Shop.css';

function ImageCompare({ before, after, alt = '' }) {
	const [pos, setPos] = useState(50);
	return (
		<div className="compare">
			<img src={after} alt={alt} className="compare-img after" />
			<div className="compare-before-wrapper" style={{ width: `${pos}%` }}>
				<img src={before} alt={alt} className="compare-img before" />
			</div>
			<input
				className="compare-range"
				type="range"
				min="0"
				max="100"
				value={pos}
				onChange={(e) => setPos(Number(e.target.value))}
				aria-label="Comparar imágenes"
			/>
		</div>
	);
}

export default function Shop() {
	return (
		<main className="shop-page" role="main">
			<section className="cover" style={{ backgroundImage: "url('https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/whatsapp-image-2023-01-19-at-3.10.46-am.jpeg')" }}>
				<div className="cover-overlay">
					<h1 className="cover-title">CATAZHO HARDCORE</h1>
					<h3 className="cover-sub">project</h3>
					<div className="cover-cta">
						<a className="btn-order" href="mailto:jassonjfer9@gmail.com?subject=Pedido&body=Hola%2C%20quiero%20ordenar">Order now</a>
					</div>
				</div>
			</section>

			<div className="content">
				<ImageCompare
					before="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/gg-1.jpg"
					after="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/ff-2-1.jpg"
				/>

				<hr className="sep" />

				<ImageCompare
					before="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/jj-1.jpg"
					after="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/hh-3.jpg"
				/>

				<hr className="sep" />

				<ImageCompare
					before="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/kk-3.jpg"
					after="https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/uuuuu-1.jpg"
				/>

				<section className="shop-footer">
					<p className="brand">CATAZHO HARDCORE</p>
					<div className="social">
						<a href="https://www.instagram.com/catazhohardcore/?hl=es" target="_blank" rel="noopener noreferrer">Instagram</a>
					</div>
				</section>
			</div>
		</main>
	);
}
