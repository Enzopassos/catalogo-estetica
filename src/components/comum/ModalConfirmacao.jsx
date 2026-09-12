import React from 'react';

/**
 * Modal de Confirmação amigável e elegante com suporte a estado de carregamento
 * @param {Object} props
 * @param {boolean} props.aberto
 * @param {string} props.titulo
 * @param {string} props.mensagem
 * @param {string} [props.textoConfirmar]
 * @param {string} [props.textoCancelar]
 * @param {boolean} [props.carregando]
 * @param {string} [props.textoCarregando]
 * @param {Function} props.onConfirmar
 * @param {Function} props.onCancelar
 */
export function ModalConfirmacao({
  aberto,
  titulo = 'Remover Procedimento?',
  mensagem = 'Tem certeza que deseja remover este item do seu agendamento?',
  textoConfirmar = 'Sim, Remover',
  textoCancelar = 'Cancelar',
  carregando = false,
  textoCarregando = 'Processando...',
  onConfirmar,
  onCancelar
}) {
  if (!aberto) return null;

  return (
    <div
      className="modal-overlay modal-confirm-overlay open"
      onClick={!carregando ? onCancelar : undefined}
    >
      <div className="modal-confirm-card" onClick={(e) => e.stopPropagation()}>
        {/* Ícone Amigável de Confirmação */}
        <div className="modal-confirm-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>

        <h3 className="modal-confirm-title">{titulo}</h3>
        <p className="modal-confirm-message">{mensagem}</p>

        <div className="modal-confirm-actions">
          <button
            type="button"
            className="btn-confirm-cancel touch-active"
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className="btn-confirm-accept touch-active"
            onClick={onConfirmar}
            disabled={carregando}
            style={carregando ? { opacity: 0.85, cursor: 'not-allowed' } : undefined}
          >
            {carregando ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner-mini"></span>
                <span>{textoCarregando}</span>
              </span>
            ) : (
              textoConfirmar
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
