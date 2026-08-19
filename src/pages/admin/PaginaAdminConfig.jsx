import React, { useState, useEffect } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function PaginaAdminConfig() {
  const { configuracoes, salvarConfiguracoes } = useCatalogo();

  const [nomeNegocio, setNomeNegocio] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [whatsappNumero, setWhatsappNumero] = useState('');
  const [instagramUsuario, setInstagramUsuario] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (configuracoes) {
      setNomeNegocio(configuracoes.nome_negocio || 'Gabriela Passos');
      setSubtitulo(configuracoes.subtitulo || 'Maquiagem • Sobrancelhas • Estética');
      setWhatsappNumero(configuracoes.whatsapp_numero || '5511999999999');
      setInstagramUsuario(configuracoes.instagram_usuario || 'gabriela.beauty');
    }
  }, [configuracoes]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      await salvarConfiguracoes({
        nome_negocio: nomeNegocio.trim(),
        subtitulo: subtitulo.trim(),
        whatsapp_numero: whatsappNumero.replace(/\D/g, ''),
        instagram_usuario: instagramUsuario.replace('@', '').trim()
      });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);
    } catch (err) {
      alert('Erro ao salvar configurações: ' + (err.message || 'Erro inesperado.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Informações do Estúdio & Contato</h2>
          <p className="admin-section-desc">
            Personalize o nome da marca, WhatsApp de agendamento e redes sociais.
          </p>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        {sucesso && (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#065f46', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            ✓ Informações do estúdio atualizadas com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputConfigNome" className="form-label">Nome da Profissional / Marca</label>
            <input
              type="text"
              id="inputConfigNome"
              className="form-input"
              value={nomeNegocio}
              onChange={(e) => setNomeNegocio(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inputConfigSubtitulo" className="form-label">Subtítulo / Especialidades</label>
            <input
              type="text"
              id="inputConfigSubtitulo"
              className="form-input"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inputConfigWhats" className="form-label">Número do WhatsApp (com DDI e DDD)</label>
            <input
              type="text"
              id="inputConfigWhats"
              className="form-input"
              placeholder="Ex: 5511999999999"
              value={whatsappNumero}
              onChange={(e) => setWhatsappNumero(e.target.value)}
              required
            />
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-secondary)', marginTop: '4px' }}>
              Os agendamentos das clientes no WhatsApp serão direcionados para este número.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="inputConfigInsta" className="form-label">Usuário do Instagram (sem @)</label>
            <input
              type="text"
              id="inputConfigInsta"
              className="form-input"
              placeholder="Ex: gabriela.beauty"
              value={instagramUsuario}
              onChange={(e) => setInstagramUsuario(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-red touch-active"
            style={{ marginTop: '14px' }}
            disabled={salvando}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{salvando ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
