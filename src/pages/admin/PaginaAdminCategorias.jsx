import React, { useState } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';
import { CardAdminCategoria } from '../../components/admin/CardAdminCategoria';
import { ModalCriarEditarCategoria } from '../../components/admin/ModalCriarEditarCategoria';
import { SkeletonCardCategoria } from '../../components/comum/SkeletonCard';

export function PaginaAdminCategorias() {
  const { categorias, carregando, criarCategoria, atualizarCategoria, excluirCategoria } = useCatalogo();

  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);

  function handleAbrirCriar() {
    setCategoriaEmEdicao(null);
    setModalAberto(true);
  }

  function handleAbrirEditar(categoria) {
    setCategoriaEmEdicao(categoria);
    setModalAberto(true);
  }

  async function handleExcluir(categoria) {
    const temServicos = categoria.quantidade_servicos > 0;
    const msg = temServicos
      ? `Atenção: A categoria "${categoria.nome}" possui ${categoria.quantidade_servicos} procedimentos vinculados. Deseja realmente excluir?`
      : `Deseja realmente excluir a categoria "${categoria.nome}"?`;

    if (window.confirm(msg)) {
      try {
        await excluirCategoria(categoria.id);
      } catch (err) {
        alert('Erro ao excluir categoria: ' + (err.message || 'Erro inesperado.'));
      }
    }
  }

  async function handleSalvar(dados) {
    if (dados.id) {
      await atualizarCategoria(dados.id, dados);
    } else {
      await criarCategoria(dados);
    }
  }

  return (
    <div>
      <div className="admin-section-header">
        <div>
          <span className="section-tag">Gestão do Catálogo</span>
          <h2 className="admin-section-title">Categorias de Atendimento</h2>
          <p className="admin-section-desc">
            Cadastre as especialidades e clique em <strong>Gerenciar Serviços</strong> para configurar procedimentos, preços e fotos.
          </p>
        </div>

        <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Nova Categoria</span>
        </button>
      </div>

      {carregando ? (
        <div className="admin-items-grid" aria-busy="true" aria-label="Carregando categorias...">
          <SkeletonCardCategoria />
          <SkeletonCardCategoria />
          <SkeletonCardCategoria />
        </div>
      ) : categorias.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <h3 className="admin-empty-title">Nenhuma categoria cadastrada</h3>
          <p className="admin-empty-desc">
            Inicie adicionando a primeira categoria de serviços do seu estúdio (ex: Maquiagem, Sobrancelhas, Estética Facial).
          </p>
          <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active" style={{ margin: '0 auto' }}>
            <span>+ Cadastrar Primeira Categoria</span>
          </button>
        </div>
      ) : (
        <div className="admin-items-grid">
          {categorias.map(cat => (
            <CardAdminCategoria
              key={cat.id || cat.slug}
              categoria={cat}
              onEditar={handleAbrirEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}

      <ModalCriarEditarCategoria
        aberto={modalAberto}
        categoria={categoriaEmEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
