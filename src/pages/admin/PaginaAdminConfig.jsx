import React, { useState, useEffect } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function PaginaAdminConfig() {
  const { configuracoes, salvarConfiguracoes, carregando } = useCatalogo();

  const [nomeNegocio, setNomeNegocio] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [whatsappNumero, setWhatsappNumero] = useState('');
  const [instagramUsuario, setInstagramUsuario] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (configuracoes) {
      setNomeNegocio(configuracoes.nome_negocio || '');
      setSubtitulo(configuracoes.subtitulo || '');
      setWhatsappNumero(configuracoes.whatsapp_numero || '');
      setInstagramUsuario(configuracoes.instagram_usuario || '');
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
    <div className="admin-config-container">
      <div className="admin-section-header">
        <div>
          <span className="section-tag">Configurações Gerais</span>
          <h2 className="admin-section-title">Informações do Estúdio & Contatos</h2>
          <p className="admin-section-desc">
            Personalize a identidade da marca, o número oficial do WhatsApp para agendamentos e seu perfil do Instagram.
          </p>
        </div>
      </div>

      {sucesso && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#065f46', padding: '14px 18px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Informações do estúdio atualizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Bloco 1: Identidade da Marca */}
        <div className="admin-config-card">
          <div className="admin-config-card-header">
            <div className="admin-config-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="admin-config-card-title">Identidade do Estúdio</h3>
              <p className="admin-config-card-desc">Nome comercial e especialidades em destaque no catálogo.</p>
            </div>
          </div>

          <div className="form-row-responsive">
            <div className="form-group">
              <label htmlFor="inputConfigNome" className="form-label">Nome da Profissional / Marca *</label>
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
              <label htmlFor="inputConfigSubtitulo" className="form-label">Subtítulo / Especialidades *</label>
              <input
                type="text"
                id="inputConfigSubtitulo"
                className="form-input"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Atendimento & WhatsApp */}
        <div className="admin-config-card">
          <div className="admin-config-card-header">
            <div className="admin-config-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="admin-config-card-title">Canal Oficial do WhatsApp</h3>
              <p className="admin-config-card-desc">Número onde você receberá as mensagens detalhadas de agendamento.</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inputConfigWhats" className="form-label">Número do WhatsApp (com DDI 55 e DDD) *</label>
            <input
              type="text"
              id="inputConfigWhats"
              className="form-input"
              placeholder="Ex: 5511999999999"
              value={whatsappNumero}
              onChange={(e) => setWhatsappNumero(e.target.value)}
              required
            />
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-secondary)', marginTop: '6px' }}>
              💡 Ao finalizar a seleção, as clientes são redirecionadas automaticamente com a mensagem montada para este WhatsApp.
            </span>
          </div>
        </div>

        {/* Bloco 3: Presença Digital */}
        <div className="admin-config-card">
          <div className="admin-config-card-header">
            <div className="admin-config-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div>
              <h3 className="admin-config-card-title">Redes Sociais (Instagram)</h3>
              <p className="admin-config-card-desc">Perfil divulgado no banner de agendamento e rodapé.</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inputConfigInsta" className="form-label">Usuário do Instagram (sem @)</label>
            <input
              type="text"
              id="inputConfigInsta"
              className="form-input"
              placeholder="Ex: gabriela.beauty"
              value={instagramUsuario}
              onChange={(e) => setInstagramUsuario(e.target.value)}
            />
            {instagramUsuario && (
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-primary-red)', fontWeight: 600, marginTop: '6px' }}>
                instagram.com/{instagramUsuario.replace('@', '').trim()}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary-red touch-active"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.9rem' }}
          disabled={salvando}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>{salvando ? 'Salvando Alterações...' : 'Salvar Todas as Configurações'}</span>
        </button>
      </form>
    </div>
  );
}

