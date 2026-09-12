import React from 'react';

/**
 * Componente modular de barra de busca em tempo real para catálogo de procedimentos
 * Segue os princípios de Responsabilidade Única (SRP) e design editorial de alta moda.
 */
export function BarraPesquisa({ valor, aoMudar, aoLimpar, placeholder = 'Buscar procedimentos...' }) {
  return (
    <div className="search-bar-container">
      <div className="search-bar-input-wrap">
        <svg
          className="search-bar-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          aria-label="Buscar procedimentos por nome ou especialidade"
        />

        {valor && valor.trim().length > 0 && (
          <button
            type="button"
            className="search-bar-clear-btn touch-active"
            onClick={aoLimpar}
            title="Limpar pesquisa"
            aria-label="Limpar texto de pesquisa"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
