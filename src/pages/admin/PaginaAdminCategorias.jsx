import React, { useState } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';
import { CardAdminCategoria } from '../../components/admin/CardAdminCategoria';
import { ModalCriarEditarCategoria } from '../../components/admin/ModalCriarEditarCategoria';

export function PaginaAdminCategorias() {
  const { categorias, criarCategoria, atualizarCategoria, excluirCategoria } = useCatalogo();

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
          <h2 className="admin-section-title">Categorias de Atendimento</h2>
          <p className="admin-section-desc">
            Crie categorias e clique em <strong>Gerenciar Serviços</strong> para administrar os procedimentos de cada área.
          </p>
        </div>

        <button type="button" onClick={handleAbrirCriar} className="btn-primary-red touch-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Nova Categoria</span>
        </button>
      </div>

      {categorias.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', borderRadius: '16px', border: '1px dashed var(--color-border-light)' }}>
          <h3>Nenhuma categoria cadastrada</h3>
          <p style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
            Clique no botão "+ Nova Categoria" acima para iniciar.
          </p>
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
