import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCatalogo } from '../../hooks/useCatalogo';
import { CardAdminServico } from '../../components/admin/CardAdminServico';
import { ModalCriarEditarServico } from '../../components/admin/ModalCriarEditarServico';

export function PaginaAdminServicos() {
  const { categoriaSlug } = useParams();
  const {
    categorias,
    servicos,
    criarServico,
    atualizarServico,
    alternarStatusServico,
    excluirServico
  } = useCatalogo();

  const categoriaAtual = categorias.find(c => c.slug === categoriaSlug);
  const servicosDaCategoria = servicos.filter(s => s.categoria_slug === categoriaSlug);

  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);

  function handleAbrirCriar() {
    setServicoEmEdicao(null);
    setModalAberto(true);
  }

  function handleAbrirEditar(servico) {
    setServicoEmEdicao(servico);
    setModalAberto(true);
  }

  async function handleToggleStatus(servico) {
    try {
      await alternarStatusServico(servico.id, servico.ativo);
    } catch (err) {
      alert('Erro ao alterar status do procedimento.');
    }
  }

  async function handleExcluir(servico) {
    if (window.confirm(`Deseja realmente excluir o procedimento "${servico.titulo}"?`)) {
      try {
        await excluirServico(servico.id);
      } catch (err) {
        alert('Erro ao excluir procedimento: ' + (err.message || 'Erro inesperado.'));
      }
    }
  }

  async function handleSalvar(dados) {
    if (dados.id) {
      await atualizarServico(dados.id, dados);
    } else {
      await criarServico(dados);
    }
  }

  return (
    <div>
      {/* Breadcrumb de Retorno */}
      <div style={{ marginBottom: '14px' }}>
        <Link to="/admin/categorias" className="admin-breadcrumb-btn touch-active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Voltar para Todas as Categorias</span>
        </Link>
      </div>

      <div className="admin-section-header">
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-primary-red)', fontWeight: 800, letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
            {categoriaAtual?.nome || categoriaSlug}
          </span>
          <h2 className="admin-section-title">Procedimentos de {categoriaAtual?.nome || categoriaSlug}</h2>
          <p className="admin-section-desc">
            Gerencie preços, duração, fotos e opcionais extras desta categoria.
          </p>
        </div>

        <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Novo Procedimento</span>
        </button>
      </div>

      {servicosDaCategoria.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', borderRadius: '16px', border: '1px dashed var(--color-border-light)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-secondary)', marginBottom: '8px' }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>Nenhum procedimento nesta categoria</h3>
          <p style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
            Clique em "+ Novo Procedimento" para cadastrar o primeiro serviço de {categoriaAtual?.nome || categoriaSlug}.
          </p>
        </div>
      ) : (
        <div className="admin-items-grid">
          {servicosDaCategoria.map(servico => (
            <CardAdminServico
              key={servico.id}
              servico={servico}
              onToggleStatus={handleToggleStatus}
              onEditar={handleAbrirEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}

      <ModalCriarEditarServico
        aberto={modalAberto}
        servico={servicoEmEdicao}
        categoria={categoriaAtual || { slug: categoriaSlug, nome: categoriaSlug }}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
