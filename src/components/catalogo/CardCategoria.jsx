import React from 'react';
import { Link } from 'react-router-dom';

export function CardCategoria({ categoria }) {
  const qtdServicos = categoria.quantidade_servicos || 0;
  const textoQtd = qtdServicos === 1 ? '1 procedimento' : `${qtdServicos} procedimentos`;

  return (
    <Link to={`/categoria/${categoria.slug}`} className="category-card touch-active">
      <div className="category-card-img-wrap">
        <img
          src={categoria.imagem_url || '/images/services/facial_spa.webp'}
          alt={categoria.nome}
          className="category-card-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/services/facial_spa.webp';
          }}
        />
        <span className="category-card-badge">{textoQtd}</span>
      </div>
      <div className="category-card-body">
        <div>
          <h3 className="category-card-title">{categoria.nome}</h3>
          <p className="category-card-desc">{categoria.descricao || 'Ver procedimentos disponíveis'}</p>
        </div>
        <div className="category-card-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
}
