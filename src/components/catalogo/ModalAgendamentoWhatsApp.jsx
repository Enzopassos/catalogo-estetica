import React, { useState } from 'react';
import { useCarrinho } from '../../hooks/useCarrinho';
import { ModalConfirmacao } from '../comum/ModalConfirmacao';

export function ModalAgendamentoWhatsApp() {
  const {
    modalAberto,
    fecharModal,
    resumoItens,
    valorTotalFormatado,
    enviarParaWhatsApp,
    removerServico
  } = useCarrinho();

  const [nomeCliente, setNomeCliente] = useState('');
  const [dataPreferencial, setDataPreferencial] = useState('');
  const [periodoPreferencial, setPeriodoPreferencial] = useState('manha');
  const [observacoes, setObservacoes] = useState('');

  // Estado para confirmação de remoção de serviço
  const [itemParaRemover, setItemParaRemover] = useState(null);

  if (!modalAberto) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!nomeCliente.trim()) return;

    enviarParaWhatsApp({
      nomeCliente,
      dataPreferencial,
      periodoPreferencial,
      observacoes
    });
  }

  function handleSolicitarRemocao(servico) {
    setItemParaRemover(servico);
  }

  function handleConfirmarRemocao() {
    if (itemParaRemover) {
      removerServico(itemParaRemover.id);
      setItemParaRemover(null);
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={fecharModal}>
        <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-handle"></div>

          <div className="sheet-header">
            <h3 className="sheet-title">Resumo do Agendamento</h3>
            <button type="button" className="btn-close-modal" onClick={fecharModal} aria-label="Fechar modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Resumo dos Itens Selecionados com Botão de Remoção */}
          <div className="cart-summary-card">
            <div className="cart-summary-items-list">
              {resumoItens.map(({ servico, adicionais, subtotal }) => (
                <div key={servico.id} className="cart-summary-row">
                  <div className="cart-summary-info">
                    <strong className="cart-summary-item-title">{servico.titulo}</strong>
                    {adicionais.length > 0 && (
                      <span className="cart-summary-addons-text">
                        + {adicionais.map(a => a.nome).join(', ')}
                      </span>
                    )}
                    <div className="cart-summary-price">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                    </div>
                  </div>

                  {/* Botão Amigável para Remover Item */}
                  <button
                    type="button"
                    className="btn-cart-remove-item touch-active"
                    onClick={() => handleSolicitarRemocao(servico)}
                    title={`Remover ${servico.titulo}`}
                    aria-label={`Remover ${servico.titulo}`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary-total-row">
              <span className="cart-summary-total-label">Total Estimado:</span>
              <strong className="cart-summary-total-value">{valorTotalFormatado}</strong>
            </div>
          </div>

          {/* Formulário de Dados da Cliente */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inputClienteNome" className="form-label">Seu Nome Completo *</label>
              <input
                type="text"
                id="inputClienteNome"
                className="form-input"
                placeholder="Ex: Maria Silva"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inputClienteData" className="form-label">Data Preferencial (Opcional)</label>
              <input
                type="date"
                id="inputClienteData"
                className="form-input"
                value={dataPreferencial}
                onChange={(e) => setDataPreferencial(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Período Preferencial</label>
              <div className="period-selector">
                <button
                  type="button"
                  className={`period-chip ${periodoPreferencial === 'manha' ? 'active' : ''}`}
                  onClick={() => setPeriodoPreferencial('manha')}
                >
                  Manhã
                </button>
                <button
                  type="button"
                  className={`period-chip ${periodoPreferencial === 'tarde' ? 'active' : ''}`}
                  onClick={() => setPeriodoPreferencial('tarde')}
                >
                  Tarde
                </button>
                <button
                  type="button"
                  className={`period-chip ${periodoPreferencial === 'indiferente' ? 'active' : ''}`}
                  onClick={() => setPeriodoPreferencial('indiferente')}
                >
                  Qualquer
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inputClienteObs" className="form-label">Observações ou Dúvidas (Opcional)</label>
              <textarea
                id="inputClienteObs"
                className="form-input"
                rows={2}
                placeholder="Ex: Tenho evento às 17h / Gostaria de tirar dúvidas"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-red touch-active" style={{ width: '100%', marginTop: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.004 3.673 3.747-.981z" />
              </svg>
              <span>Enviar Agendamento no WhatsApp</span>
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Confirmação de Remoção com Design Agradável */}
      <ModalConfirmacao
        aberto={!!itemParaRemover}
        titulo="Remover Procedimento?"
        mensagem={`Deseja remover "${itemParaRemover?.titulo}" do seu agendamento?`}
        textoConfirmar="Sim, Remover"
        textoCancelar="Manter Procedimento"
        onConfirmar={handleConfirmarRemocao}
        onCancelar={() => setItemParaRemover(null)}
      />
    </>
  );
}
