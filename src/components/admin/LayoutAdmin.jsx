import React from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import { useCatalogo } from '../../hooks/useCatalogo';

export function LayoutAdmin() {
  const { usuario, fazerLogout } = useAutenticacao();
  const { categorias, configuracoes, quantidadeAvaliacoesPendentes, avaliacoes } = useCatalogo();
  const navigate = useNavigate();
  const location = useLocation();

  const isTabCategorias = location.pathname.startsWith('/admin/categorias');
  const isTabConfig = location.pathname.startsWith('/admin/configuracoes');
  const isTabAvaliacoes = location.pathname.startsWith('/admin/avaliacoes');

  async function handleLogout() {
    if (window.confirm('Deseja realmente sair do painel administrativo?')) {
      await fazerLogout();
      navigate('/');
    }
  }

  return (
    <div className="admin-layout-container">
      {/* Top Navbar Editorial */}
      <header className="admin-top-nav">
        <div className="admin-nav-brand">
          <img
            src={configuracoes?.logo_url || '/images/logo.jpg'}
            alt={configuracoes?.nome_negocio || 'Gabriela Beauty'}
            className="admin-nav-avatar"
          />
          <div className="admin-brand-texts">
            <div className="admin-badge-role-wrap">
              <span className="admin-badge-role">Painel de Gestão</span>
            </div>
            <h1 className="admin-title">{configuracoes?.nome_negocio || 'Gabriela Passos'}</h1>
            <span className="admin-user-email">{usuario?.email || 'Profissional Conectada'}</span>
          </div>
        </div>

        <div className="admin-nav-actions">
          <Link to="/" className="btn-admin-secondary touch-active" title="Visualizar Catálogo Público">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Ver Catálogo</span>
          </Link>

          <button type="button" onClick={handleLogout} className="btn-admin-danger touch-active" title="Sair do Painel">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Três Abas Principais em Segmented Chips */}
      <nav className="admin-tabs-nav">
        <NavLink
          to="/admin/categorias"
          className={`admin-tab-btn ${isTabCategorias ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Categorias & Serviços</span>
          <span className="admin-tab-counter-badge">{categorias.length}</span>
        </NavLink>

        <NavLink
          to="/admin/avaliacoes"
          className={`admin-tab-btn ${isTabAvaliacoes ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Avaliações</span>
          {quantidadeAvaliacoesPendentes > 0 ? (
            <span className="admin-tab-counter-badge badge-destaque" title={`${quantidadeAvaliacoesPendentes} pendentes de aprovação`}>
              {quantidadeAvaliacoesPendentes} pendente{quantidadeAvaliacoesPendentes > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="admin-tab-counter-badge">{avaliacoes.length}</span>
          )}
        </NavLink>

        <NavLink
          to="/admin/configuracoes"
          className={`admin-tab-btn ${isTabConfig ? 'active' : ''}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Informações do Estúdio</span>
        </NavLink>
      </nav>

      {/* Conteúdo Dinâmico */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

