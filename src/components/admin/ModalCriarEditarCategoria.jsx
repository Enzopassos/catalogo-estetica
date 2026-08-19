import React, { useState, useEffect } from 'react';
import { UploadImagem } from './UploadImagem';

export function ModalCriarEditarCategoria({ categoria, aberto, onFechar, onSalvar }) {
  const [nome, setNome] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const isEdicao = !!categoria;

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome || '');
      setImagemUrl(categoria.imagem_url || '');
      setDescricao(categoria.descricao || '');
    } else {
      setNome('');
      setImagemUrl('/images/services/facial_spa.png');
      setDescricao('');
    }
  }, [categoria, aberto]);

  if (!aberto) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) return;

    setSalvando(true);
    try {
      await onSalvar({
        id: categoria?.id,
        nome: nome.trim(),
        imagem_url: imagemUrl.trim() || '/images/services/facial_spa.png',
        descricao: descricao.trim(),
        ordem: categoria?.ordem || 0
      });
      onFechar();
    } catch (err) {
      alert('Erro ao salvar categoria: ' + (err.message || 'Verifique os dados.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={onFechar}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <span className="section-tag" style={{ marginBottom: '2px' }}>Gestão de Categoria</span>
            <h3 className="admin-modal-title">{isEdicao ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onFechar} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputCatNome" className="form-label">Nome da Categoria *</label>
            <input
              type="text"
              id="inputCatNome"
              className="form-input"
              placeholder="Ex: Maquiagem, Sobrancelhas, Estética Geral"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <UploadImagem
            valor={imagemUrl}
            onAlterar={setImagemUrl}
            pasta="categorias"
            label="Foto de Capa da Categoria *"
            placeholderPadrao="/images/services/facial_spa.png"
          />

          <div className="form-group">
            <label htmlFor="inputCatDesc" className="form-label">Descrição Resumida</label>
            <textarea
              id="inputCatDesc"
              className="form-input"
              rows={3}
              placeholder="Ex: Procedimentos exclusivos com técnicas avançadas e produtos de alta performance..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
            <button type="button" className="btn-admin-secondary touch-active" onClick={onFechar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-red touch-active" disabled={salvando}>
              <span>{salvando ? 'Salvando...' : (isEdicao ? 'Salvar Alterações' : 'Criar Categoria')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


