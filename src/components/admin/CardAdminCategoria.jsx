import React from 'react';
import { Link } from 'react-router-dom';

export function CardAdminCategoria({ categoria, onEditar, onExcluir }) {
  const qtdServicos = categoria.quantidade_servicos || 0;
  const textoQtd = qtdServicos === 1 ? '1 procedimento' : `${qtdServicos} procedimentos`;

  return (
    <div className="admin-item-card">
      <div className="admin-card-thumb-wrap">
        <img
          src={categoria.imagem_url || '/images/services/facial_spa.webp'}
          alt={categoria.nome}
          className="admin-card-thumb"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/services/facial_spa.webp';
          }}
        />
        <span className="admin-card-badge-count">{textoQtd}</span>
      </div>

      <div className="admin-card-body">
        <h3 className="admin-card-title">{categoria.nome}</h3>
        <p className="admin-card-desc">{categoria.descricao || 'Sem descrição informada para esta categoria.'}</p>

        {/* Link Destaque: Gerenciar Serviços da Categoria */}
        <Link to={`/admin/categorias/${categoria.slug}`} className="btn-manage-services touch-active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Gerenciar Serviços ({qtdServicos})</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>

        <div className="admin-card-footer">
          <button type="button" onClick={() => onEditar(categoria)} className="btn-admin-edit touch-active" title="Editar Categoria">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Editar</span>
          </button>

          <button type="button" onClick={() => onExcluir(categoria)} className="btn-admin-delete touch-active" title="Excluir Categoria">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

