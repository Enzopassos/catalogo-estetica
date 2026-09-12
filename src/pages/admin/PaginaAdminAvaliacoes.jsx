import React, { useState } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';
import { ModalConfirmacao } from '../../components/comum/ModalConfirmacao';

function formatarDataCompleta(dataIso) {
  if (!dataIso) return '';
  try {
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  } catch {
    return '';
  }
}

export function PaginaAdminAvaliacoes() {
  const {
    avaliacoes,
    avaliacoesPendentes,
    avaliacoesAprovadas,
    quantidadeAvaliacoesPendentes,
    carregando,
    aprovarAvaliacao,
    desaprovarAvaliacao,
    excluirAvaliacao
  } = useCatalogo();

  const [filtroAtivo, setFiltroAtivo] = useState('pendentes'); // 'pendentes' | 'aprovadas' | 'todas'
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [itemParaAprovar, setItemParaAprovar] = useState(null);
  const [salvandoAprovacao, setSalvandoAprovacao] = useState(false);
  const [salvandoExclusao, setSalvandoExclusao] = useState(false);
  const [toastMensagem, setToastMensagem] = useState('');
  const [processandoId, setProcessandoId] = useState(null);

  // Lista de acordo com o filtro selecionado
  const avaliacoesFiltradas = avaliacoes.filter((item) => {
    if (filtroAtivo === 'pendentes') return !item.aprovado;
    if (filtroAtivo === 'aprovadas') return item.aprovado;
    return true;
  });

  async function handleConfirmarAprovacao() {
    if (!itemParaAprovar) return;
    const id = itemParaAprovar.id;
    setSalvandoAprovacao(true);

    try {
      await aprovarAvaliacao(id);
      setItemParaAprovar(null);
      setToastMensagem('✓ Avaliação aprovada e publicada no catálogo com sucesso!');
      setTimeout(() => setToastMensagem(''), 4000);
    } catch (err) {
      alert('Erro ao aprovar avaliação: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSalvandoAprovacao(false);
    }
  }

  async function handleDesaprovar(id) {
    setProcessandoId(id);
    try {
      await desaprovarAvaliacao(id);
      setToastMensagem('Avaliação ocultada do catálogo.');
      setTimeout(() => setToastMensagem(''), 4000);
    } catch (err) {
      alert('Erro ao ocultar avaliação: ' + (err.message || 'Tente novamente.'));
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleConfirmarExclusao() {
    if (!itemParaExcluir) return;
    const id = itemParaExcluir.id;
    setSalvandoExclusao(true);

    try {
      await excluirAvaliacao(id);
      setItemParaExcluir(null);
      setToastMensagem('✓ Avaliação removida permanentemente.');
      setTimeout(() => setToastMensagem(''), 4000);
    } catch (err) {
      alert('Erro ao excluir avaliação: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSalvandoExclusao(false);
    }
  }

  return (
    <div>
      {/* Cabeçalho da Seção Administrativa */}
      <div className="admin-section-header">
        <div>
          <span className="section-tag">Moderação de Conteúdo</span>
          <h2 className="admin-section-title">Avaliações & Depoimentos</h2>
          <p className="admin-section-desc">
            Valide as avaliações enviadas pelas clientes. Depoimentos aprovados ficam visíveis imediatamente no catálogo.
          </p>
        </div>
      </div>

      {/* Barra de Filtros em Chips Segmentados */}
      <div className="admin-filtros-avaliacoes">
        <button
          type="button"
          className={`admin-filtro-chip touch-active ${filtroAtivo === 'pendentes' ? 'active' : ''}`}
          onClick={() => setFiltroAtivo('pendentes')}
        >
          <span>Pendentes</span>
          <span className={`admin-filtro-badge ${quantidadeAvaliacoesPendentes > 0 ? 'destaque' : ''}`}>
            {quantidadeAvaliacoesPendentes}
          </span>
        </button>

        <button
          type="button"
          className={`admin-filtro-chip touch-active ${filtroAtivo === 'aprovadas' ? 'active' : ''}`}
          onClick={() => setFiltroAtivo('aprovadas')}
        >
          <span>Aprovadas no Site</span>
          <span className="admin-filtro-badge">
            {avaliacoesAprovadas.length}
          </span>
        </button>

        <button
          type="button"
          className={`admin-filtro-chip touch-active ${filtroAtivo === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltroAtivo('todas')}
        >
          <span>Todas</span>
          <span className="admin-filtro-badge">
            {avaliacoes.length}
          </span>
        </button>
      </div>

      {/* Listagem de Avaliações */}
      {carregando ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--color-secondary)' }}>
          Carregando avaliações...
        </div>
      ) : avaliacoesFiltradas.length === 0 ? (
        <div className="admin-empty-state" style={{ marginTop: '20px' }}>
          <div className="admin-empty-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h3 className="admin-empty-title">
            {filtroAtivo === 'pendentes'
              ? 'Tudo em dia por aqui!'
              : filtroAtivo === 'aprovadas'
              ? 'Nenhuma avaliação publicada'
              : 'Nenhuma avaliação cadastrada'}
          </h3>
          <p className="admin-empty-desc">
            {filtroAtivo === 'pendentes'
              ? 'Não há avaliações aguardando moderação no momento.'
              : filtroAtivo === 'aprovadas'
              ? 'Aprove avaliações pendentes para que elas apareçam no catálogo público.'
              : 'Quando suas clientes enviarem depoimentos pelo site, eles aparecerão nesta tela para sua aprovação.'}
          </p>
        </div>
      ) : (
        <div className="admin-avaliacoes-grid">
          {avaliacoesFiltradas.map((item) => {
            const isPendente = !item.aprovado;
            const estrelas = Math.max(1, Math.min(5, Number(item.estrelas) || 5));
            const emProcessamento = processandoId === item.id;

            return (
              <div
                key={item.id}
                className={`admin-avaliacao-card ${isPendente ? 'card-pendente' : 'card-aprovado'}`}
              >
                <div className="admin-avaliacao-header">
                  <div>
                    <div className="admin-avaliacao-cliente-nome">
                      {item.nome_cliente}
                      {item.servico_realizado && (
                        <span className="admin-avaliacao-servico">
                          ({item.servico_realizado})
                        </span>
                      )}
                    </div>
                    <div className="admin-avaliacao-data">
                      {formatarDataCompleta(item.criado_em)}
                    </div>
                  </div>

                  <div className="admin-avaliacao-status-col">
                    <span className={`admin-badge-status ${isPendente ? 'status-pendente' : 'status-aprovado'}`}>
                      {isPendente ? '● Pendente' : '✓ Publicada'}
                    </span>
                    <div className="admin-avaliacao-stars" aria-label={`${estrelas} estrelas`}>
                      {'★'.repeat(estrelas)}
                      {'☆'.repeat(5 - estrelas)}
                    </div>
                  </div>
                </div>

                <div className="admin-avaliacao-conteudo">
                  "{item.depoimento}"
                </div>

                <div className="admin-avaliacao-actions">
                  {isPendente ? (
                    <button
                      type="button"
                      className="btn-admin-aprovar touch-active"
                      onClick={() => setItemParaAprovar(item)}
                      disabled={emProcessamento}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Aprovar & Publicar</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-admin-ocultar touch-active"
                      onClick={() => handleDesaprovar(item.id)}
                      disabled={emProcessamento}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <span>{emProcessamento ? 'Ocultando...' : 'Ocultar do Site'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-admin-excluir touch-active"
                    onClick={() => setItemParaExcluir(item)}
                    disabled={emProcessamento}
                    title="Excluir Avaliação Permanentemente"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação para Aprovação com Loading State */}
      <ModalConfirmacao
        aberto={!!itemParaAprovar}
        titulo="Aprovar e Publicar Avaliação?"
        mensagem={`Deseja aprovar o depoimento de "${itemParaAprovar?.nome_cliente}"? Ele ficará imediatamente visível para todos os visitantes no catálogo público.`}
        textoConfirmar="Sim, Aprovar"
        textoCancelar="Cancelar"
        carregando={salvandoAprovacao}
        textoCarregando="Aprovando..."
        onConfirmar={handleConfirmarAprovacao}
        onCancelar={() => !salvandoAprovacao && setItemParaAprovar(null)}
      />

      {/* Modal de Confirmação para Exclusão com Loading State */}
      <ModalConfirmacao
        aberto={!!itemParaExcluir}
        titulo="Excluir Avaliação Permanentemente?"
        mensagem={`Deseja realmente remover o depoimento de "${itemParaExcluir?.nome_cliente}"? Esta ação removerá o registro do banco de dados.`}
        textoConfirmar="Sim, Excluir"
        textoCancelar="Cancelar"
        carregando={salvandoExclusao}
        textoCarregando="Excluindo..."
        onConfirmar={handleConfirmarExclusao}
        onCancelar={() => !salvandoExclusao && setItemParaExcluir(null)}
      />

      {/* Toast Flutuante no Rodapé */}
      {toastMensagem && (
        <div className="admin-toast-flutuante" role="status" aria-live="polite">
          <div className="admin-toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span>{toastMensagem}</span>
        </div>
      )}
    </div>
  );
}
