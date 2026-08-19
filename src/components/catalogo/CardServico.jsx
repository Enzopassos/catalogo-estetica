import React from 'react';
import { useCarrinho } from '../../hooks/useCarrinho';

export function CardServico({ servico, nomeCategoria }) {
  const { alternarServico, alternarAdicional, possuiServico, possuiAdicional } = useCarrinho();

  const isSelected = possuiServico(servico.id);

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(servico.preco);

  const duracaoFormatada = servico.duracao_minutos >= 60
    ? `${Math.floor(servico.duracao_minutos / 60)}h${servico.duracao_minutos % 60 > 0 ? ` ${servico.duracao_minutos % 60}min` : ''}`
    : `${servico.duracao_minutos} min`;

  const listaAddons = servico.adicionais || [];

  return (
    <article className={`service-card ${isSelected ? 'selected' : ''}`}>
      <div className="service-card-image-wrap">
        <img
          src={servico.imagem_url || '/images/services/makeup_glam.png'}
          alt={servico.titulo}
          className="service-card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/services/makeup_glam.png';
          }}
        />
        <span className="service-badge-category">{nomeCategoria || 'Estética'}</span>
      </div>

      <div className="service-card-content">
        <div className="service-card-header">
          <h3 className="service-title">{servico.titulo}</h3>
          <div className="service-price">{precoFormatado}</div>
        </div>

        <div className="service-meta">
          <div className="service-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{duracaoFormatada}</span>
          </div>
        </div>

        <p className="service-description">{servico.descricao}</p>

        {listaAddons.length > 0 && (
          <div className="addons-wrap">
            <div className="addons-title">Adicionais Opcionais</div>
            <div className="addons-list">
              {listaAddons.map(addon => {
                const isAddonActive = possuiAdicional(servico.id, addon.id);
                const addonPrecoFormatado = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(addon.preco);

                return (
                  <button
                    key={addon.id}
                    type="button"
                    className={`addon-chip ${isAddonActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isSelected) {
                        alternarServico(servico);
                      }
                      alternarAdicional(servico, addon.id);
                    }}
                  >
                    <span>+ {addon.nome}</span>
                    <span>({addonPrecoFormatado})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          className={`btn-select-service ${isSelected ? 'selected' : ''}`}
          onClick={() => alternarServico(servico)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isSelected ? (
              <polyline points="20 6 9 17 4 12"></polyline>
            ) : (
              <>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </>
            )}
          </svg>
          <span>{isSelected ? 'Selecionado' : 'Adicionar ao Agendamento'}</span>
        </button>
      </div>
    </article>
  );
}
