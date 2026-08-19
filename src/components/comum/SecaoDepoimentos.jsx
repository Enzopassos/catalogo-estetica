import React from 'react';

export function SecaoDepoimentos() {
  return (
    <div style={{ marginTop: 'var(--section-gap)' }}>
      <div className="section-title-wrap">
        <span className="section-tag">Depoimentos</span>
        <h2 className="headline-md">O que dizem as clientes</h2>
      </div>

      <div className="testimonial-card">
        <div className="testimonial-stars">★★★★★</div>
        <p className="testimonial-text">
          "A make durou a festa inteira impecável! A Gabi tem um cuidado surreal com a pele antes da maquiagem. Indico de olhos fechados!"
        </p>
        <div className="testimonial-author">— Marina Alencar (Noiva)</div>
      </div>

      <div className="testimonial-card">
        <div className="testimonial-stars">★★★★★</div>
        <p className="testimonial-text">
          "Minha Brow Lamination mudou completamente meu olhar! Ficou superfiel ao meu estilo, nada artificial. Perfeito!"
        </p>
        <div className="testimonial-author">— Camila Fernandes</div>
      </div>
    </div>
  );
}
