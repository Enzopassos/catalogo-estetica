import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/useAutenticacao';

export function RotaProtegida() {
  const { estaAutenticado, carregando } = useAutenticacao();

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

  return <Outlet />;
}
