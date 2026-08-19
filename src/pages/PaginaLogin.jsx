import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAutenticacao } from '../hooks/useAutenticacao';

export function PaginaLogin() {
  const { estaAutenticado, fazerLogin } = useAutenticacao();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (estaAutenticado) {
    return <Navigate to="/admin/categorias" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await fazerLogin(email, senha);
      navigate('/admin/categorias');
    } catch (err) {
      setErro(err.message || 'Erro ao realizar login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbf9f9', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#ffffff', border: '1px solid var(--color-border-light)', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.07)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 14px', borderRadius: '50%', background: 'rgba(182, 26, 0, 0.08)', border: '1px solid rgba(182, 26, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b61a00' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="headline-md" style={{ color: 'var(--color-on-surface)' }}>Acesso Administrativo</h2>
          <p className="body-sm" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>Área de gestão da profissional.</p>
        </div>

        {erro && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.825rem', marginBottom: '16px', textAlign: 'center' }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputLoginEmail" className="form-label">E-mail</label>
            <input
              type="email"
              id="inputLoginEmail"
              className="form-input"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="inputLoginSenha" className="form-label">Senha</label>
            <input
              type="password"
              id="inputLoginSenha"
              className="form-input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary-red touch-active"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={carregando}
          >
            <span>{carregando ? 'Entrando...' : 'Entrar no Painel'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
          <Link to="/" style={{ color: 'var(--color-primary-red)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>← Voltar para o Catálogo</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
