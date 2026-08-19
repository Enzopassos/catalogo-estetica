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
      <Link to="/admin/categorias" className="admin-breadcrumb-btn touch-active">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Voltar para Todas as Categorias</span>
      </Link>

      <div className="admin-section-header">
        <div>
          <span className="section-tag">{categoriaAtual?.nome || 'Procedimentos'}</span>
          <h2 className="admin-section-title">Procedimentos de {categoriaAtual?.nome || categoriaSlug}</h2>
          <p className="admin-section-desc">
            Configure valores, tempos de execução, fotos ilustrativas e opções de adicionais para esta área.
          </p>
        </div>

        <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Novo Procedimento</span>
        </button>
      </div>

      {servicosDaCategoria.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 className="admin-empty-title">Nenhum procedimento nesta categoria</h3>
          <p className="admin-empty-desc">
            Cadastre o primeiro serviço de {categoriaAtual?.nome || categoriaSlug} para disponibilizar no catálogo aos seus clientes.
          </p>
          <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active" style={{ margin: '0 auto' }}>
            <span>+ Cadastrar Primeiro Procedimento</span>
          </button>
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

