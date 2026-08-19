import React, { useState, useEffect } from 'react';
import { UploadImagem } from './UploadImagem';

export function ModalCriarEditarServico({ servico, categoria, aberto, onFechar, onSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [preco, setPreco] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState(60);
  const [imagemUrl, setImagemUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ativo, setAtivo] = useState(true);

  const [possuiAdicionais, setPossuiAdicionais] = useState(false);
  const [adicionais, setAdicionais] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const isEdicao = !!servico;

  useEffect(() => {
    if (servico) {
      setTitulo(servico.titulo || '');
      setPreco(servico.preco !== undefined ? servico.preco : '');
      setDuracaoMinutos(servico.duracao_minutos || 60);
      setImagemUrl(servico.imagem_url || '');
      setDescricao(servico.descricao || '');
      setAtivo(servico.ativo !== undefined ? servico.ativo : true);

      const addons = servico.adicionais || [];
      setPossuiAdicionais(addons.length > 0);
      setAdicionais(addons.map(a => ({ ...a })));
    } else {
      setTitulo('');
      setPreco('');
      setDuracaoMinutos(60);
      setImagemUrl('/images/services/makeup_glam.png');
      setDescricao('');
      setAtivo(true);
      setPossuiAdicionais(false);
      setAdicionais([]);
    }
  }, [servico, aberto]);

  if (!aberto) return null;

  function handleTogglePossuiAdicionais(e) {
    const marcado = e.target.checked;
    setPossuiAdicionais(marcado);
    if (marcado && adicionais.length === 0) {
      setAdicionais([{ id: `add-${Date.now()}`, nome: '', preco: 0 }]);
    }
  }

  function handleAddAdicional() {
    setAdicionais(prev => [...prev, { id: `add-${Date.now()}`, nome: '', preco: 0 }]);
  }

  function handleUpdateAdicional(index, campo, valor) {
    setAdicionais(prev => {
      const novo = [...prev];
      novo[index] = { ...novo[index], [campo]: valor };
      return novo;
    });
  }

  function handleRemoverAdicional(index) {
    setAdicionais(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim()) return;

    const listaAdicionaisValidos = possuiAdicionais
      ? adicionais.filter(a => a.nome && a.nome.trim() !== '')
      : [];

    setSalvando(true);
    try {
      await onSalvar({
        id: servico?.id,
        categoria_id: categoria?.id || null,
        categoria_slug: categoria?.slug || 'geral',
        titulo: titulo.trim(),
        preco: parseFloat(preco) || 0,
        duracao_minutos: parseInt(duracaoMinutos, 10) || 30,
        imagem_url: imagemUrl.trim() || '/images/services/makeup_glam.png',
        descricao: descricao.trim(),
        adicionais: listaAdicionaisValidos,
        ativo,
        ordem: servico?.ordem || 0
      });
      onFechar();
    } catch (err) {
      alert('Erro ao salvar procedimento: ' + (err.message || 'Verifique os dados.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={onFechar}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <span className="section-tag" style={{ marginBottom: '2px' }}>
              {categoria?.nome || 'Procedimento'}
            </span>
            <h3 className="admin-modal-title">
              {isEdicao ? 'Editar Procedimento' : 'Novo Procedimento'}
            </h3>
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
            <label htmlFor="inputServicoTitulo" className="form-label">Nome do Procedimento *</label>
            <input
              type="text"
              id="inputServicoTitulo"
              className="form-input"
              placeholder="Ex: Maquiagem Social Glam"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label htmlFor="inputServicoPreco" className="form-label">Preço Base (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="inputServicoPreco"
                className="form-input"
                placeholder="180.00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="inputServicoDuracao" className="form-label">Duração (Minutos) *</label>
              <input
                type="number"
                step="5"
                min="5"
                id="inputServicoDuracao"
                className="form-input"
                placeholder="60"
                value={duracaoMinutos}
                onChange={(e) => setDuracaoMinutos(e.target.value)}
                required
              />
            </div>
          </div>

          <UploadImagem
            valor={imagemUrl}
            onAlterar={setImagemUrl}
            pasta="servicos"
            label="Foto / Imagem do Procedimento *"
            placeholderPadrao="/images/services/makeup_glam.png"
          />

          <div className="form-group">
            <label htmlFor="inputServicoDesc" className="form-label">Descrição do Procedimento</label>
            <textarea
              id="inputServicoDesc"
              className="form-input"
              rows={3}
              placeholder="Descreva os benefícios, materiais e técnicas utilizadas..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          {/* Controle Dinâmico: Possui opcionais extras? */}
          <div style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
            <label className="custom-checkbox-wrap">
              <input
                type="checkbox"
                checked={possuiAdicionais}
                onChange={handleTogglePossuiAdicionais}
              />
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                Este procedimento possui opções de adicionais extras?
              </span>
            </label>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-secondary)', marginLeft: '24px', marginTop: '2px' }}>
              Ex: Cílios 3D, Iluminação de colo, Spa labial complementar.
            </span>
          </div>

          {/* Construtor de Adicionais Opcionais */}
          {possuiAdicionais && (
            <div className="admin-addons-builder">
              <div className="addons-builder-header">
                <span className="form-label" style={{ margin: 0, color: 'var(--color-primary-red)' }}>
                  Adicionais / Opcionais Extras
                </span>
                <button
                  type="button"
                  onClick={handleAddAdicional}
                  className="btn-admin-secondary touch-active"
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                >
                  + Adicionar Opcional
                </button>
              </div>

              <div className="addons-builder-list">
                {adicionais.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', margin: '8px 0' }}>
                    Nenhum opcional configurado. Clique em "+ Adicionar Opcional".
                  </p>
                ) : (
                  adicionais.map((addon, index) => (
                    <div key={addon.id} className="addon-builder-row">
                      <input
                        type="text"
                        className="form-input addon-name-input"
                        placeholder="Nome do Opcional (ex: Cílios 3D)"
                        value={addon.nome}
                        onChange={(e) => handleUpdateAdicional(index, 'nome', e.target.value)}
                        required
                      />
                      <div className="addon-price-wrap">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-input"
                          placeholder="25.00"
                          value={addon.preco}
                          onChange={(e) => handleUpdateAdicional(index, 'preco', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverAdicional(index)}
                        className="btn-admin-delete touch-active"
                        title="Remover Opcional"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Switch de Ativo / Visível no Catálogo */}
          <div style={{ marginBottom: '18px', background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '12px 16px' }}>
            <label className="custom-checkbox-wrap">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ativo e visível para agendamento no catálogo</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
            <button type="button" className="btn-admin-secondary touch-active" onClick={onFechar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-red touch-active" disabled={salvando}>
              <span>{salvando ? 'Salvando...' : (isEdicao ? 'Salvar Alterações' : 'Cadastrar Procedimento')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


