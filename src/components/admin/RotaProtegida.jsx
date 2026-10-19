import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/useAutenticacao';

export function RotaProtegida() {
  const { estaAutenticado, ehAdmin, carregando, fazerLogout } = useAutenticacao();

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Carregando painel...</p>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário está logado mas NÃO possui cargo administrativo neste sistema
  if (!ehAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--color-surface, #fbf9f9)'
      }}>
        <div style={{
          maxWidth: '420px',
          background: 'var(--color-surface-container-lowest, #ffffff)',
          border: '1px solid var(--color-outline-variant, #e8bdb4)',
          borderRadius: '8px',
          padding: '32px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--color-error, #ba1a1a)',
            marginBottom: '12px',
            fontSize: '22px'
          }}>
            Acesso Restrito
          </h2>
          <p style={{
            color: 'var(--color-on-surface-variant, #5e3f39)',
            fontSize: '14px',
            lineHeight: 1.5,
            marginBottom: '24px'
          }}>
            Sua conta não possui permissão de administrador neste sistema.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/"
              className="btn-touch-primary"
              style={{
                padding: '10px 18px',
                background: 'var(--color-primary, #b61a00)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Ir para o Catálogo
            </Link>
            <button
              type="button"
              onClick={fazerLogout}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: '1px solid var(--color-outline, #936e67)',
                color: 'var(--color-on-surface, #1b1c1c)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Trocar de Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
