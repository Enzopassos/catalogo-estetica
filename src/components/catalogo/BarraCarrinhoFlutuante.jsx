import React from 'react';
import { useCarrinho } from '../../hooks/useCarrinho';

export function BarraCarrinhoFlutuante() {
  const { quantidadeTotal, valorTotalFormatado, abrirModal } = useCarrinho();

  if (quantidadeTotal === 0) return null;

  return (
    <div className="sticky-cart-bar">
      <div className="cart-bar-info">
        <span className="cart-bar-count">
          {quantidadeTotal === 1 ? '1 serviço selecionado' : `${quantidadeTotal} serviços selecionados`}
        </span>
        <span className="cart-bar-total">{valorTotalFormatado}</span>
      </div>

      <button type="button" className="btn-primary-red touch-active" onClick={abrirModal}>
        <span>Finalizar no WhatsApp</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
}
