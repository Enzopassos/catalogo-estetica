import React from 'react';
import { Link } from 'react-router-dom';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useAutenticacao } from '../../hooks/useAutenticacao';

export function CabecalhoMarca() {
  const { configuracoes } = useCatalogo();
  const { estaAutenticado } = useAutenticacao();

  return (
    <header className="brand-header">
      <div className="brand-header-top">
        <img
          src="/images/f7c954cb-9325-456f-9cbf-4731db3ab44a_IMG-6726.jpeg"
          alt="Monograma GP"
          className="brand-logo-monogram"
        />
        <img
          src="/images/I0H9wR3zSyPLDxG8mdDg_XMQUab25GgxFIX1c.jpg"
          alt="Logo Gabriela Beauty"
          className="brand-icon-lips"
        />
      </div>

      <h1 className="brand-title">{configuracoes?.nome_negocio || 'Gabriela Passos'}</h1>
      <p className="brand-subtitle">{configuracoes?.subtitulo || 'Maquiagem • Sobrancelhas • Estética'}</p>

      <div className="brand-header-actions">
        <Link
          to={estaAutenticado ? '/admin/categorias' : '/login'}
          className="admin-access-btn"
          aria-label="Acesso Administrativo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>{estaAutenticado ? 'Painel da Profissional (Logada)' : 'Área da Profissional'}</span>
        </Link>
      </div>
    </header>
  );
}
