import React from 'react';

export function CardAdminServico({ servico, onToggleStatus, onEditar, onExcluir }) {
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(servico.preco);

  const duracaoFormatada = servico.duracao_minutos >= 60
    ? `${Math.floor(servico.duracao_minutos / 60)}h${servico.duracao_minutos % 60 > 0 ? ` ${servico.duracao_minutos % 60}min` : ''}`
    : `${servico.duracao_minutos} min`;

  const listaAddons = servico.adicionais || [];

  return (
    <div className={`admin-item-card ${servico.ativo ? '' : 'inactive'}`}>
      <div className="admin-card-thumb-wrap">
        <img
          src={servico.imagem_url || '/images/services/makeup_glam.png'}
          alt={servico.titulo}
          className="admin-card-thumb"
          onError={(e) => {
            e.currentTarget.src = '/images/services/makeup_glam.png';
          }}
        />
        <span className={`admin-card-status-badge ${servico.ativo ? 'status-ativo' : 'status-inativo'}`}>
          {servico.ativo ? 'Ativo no Catálogo' : 'Oculto'}
        </span>
      </div>

      <div className="admin-card-body">
        <div className="admin-card-meta-top">
          <span className="admin-duration-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {duracaoFormatada}
          </span>
        </div>

        <h3 className="admin-card-title">{servico.titulo}</h3>
        <div className="admin-card-price">{precoFormatado}</div>
        <p className="admin-card-desc">{servico.descricao}</p>

        <div className="admin-addons-section">
          <div className="admin-addons-title">Adicionais Extras:</div>
          <div className="admin-addons-list">
            {listaAddons.length > 0 ? (
              listaAddons.map(a => (
                <span key={a.id} className="admin-addon-pill">
                  + {a.nome} ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(a.preco)})
                </span>
              ))
            ) : (
              <span className="admin-text-muted">Nenhum adicional configurado</span>
            )}
          </div>
        </div>

        <div className="admin-card-footer">
          <button
            type="button"
            className="btn-admin-icon"
            onClick={() => onToggleStatus(servico)}
            title={servico.ativo ? 'Desativar' : 'Ativar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {servico.ativo ? (
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              ) : (
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              )}
            </svg>
            <span>{servico.ativo ? 'Ocultar' : 'Exibir'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" onClick={() => onEditar(servico)} className="btn-admin-edit touch-active">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Editar</span>
            </button>

            <button type="button" onClick={() => onExcluir(servico)} className="btn-admin-delete touch-active" title="Excluir Procedimento">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
