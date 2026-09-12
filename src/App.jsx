import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './contexts/ContextoAutenticacao';
import { ProvedorCatalogo } from './contexts/ContextoCatalogo';
import { ProvedorCarrinho } from './contexts/ContextoCarrinho';

// Páginas Públicas Principais (Carregamento Imediato)
import { PaginaCatalogoCategorias } from './pages/PaginaCatalogoCategorias';
import { PaginaProcedimentos } from './pages/PaginaProcedimentos';

// Code-Splitting: Rotas Administrativas e de Login (Carregadas sob demanda)
const PaginaLogin = React.lazy(() => import('./pages/PaginaLogin').then(m => ({ default: m.PaginaLogin })));
const RotaProtegida = React.lazy(() => import('./components/admin/RotaProtegida').then(m => ({ default: m.RotaProtegida })));
const LayoutAdmin = React.lazy(() => import('./components/admin/LayoutAdmin').then(m => ({ default: m.LayoutAdmin })));
const PaginaAdminCategorias = React.lazy(() => import('./pages/admin/PaginaAdminCategorias').then(m => ({ default: m.PaginaAdminCategorias })));
const PaginaAdminServicos = React.lazy(() => import('./pages/admin/PaginaAdminServicos').then(m => ({ default: m.PaginaAdminServicos })));
const PaginaAdminConfig = React.lazy(() => import('./pages/admin/PaginaAdminConfig').then(m => ({ default: m.PaginaAdminConfig })));
const PaginaAdminAvaliacoes = React.lazy(() => import('./pages/admin/PaginaAdminAvaliacoes').then(m => ({ default: m.PaginaAdminAvaliacoes })));

function FallbackCarregamento() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Carregando área...</p>
    </div>
  );
}

export function App() {
  return (
    <ProvedorAutenticacao>
      <ProvedorCatalogo>
        <ProvedorCarrinho>
          <Suspense fallback={<FallbackCarregamento />}>
            <Routes>
              {/* Rotas Públicas do Catálogo */}
              <Route path="/" element={<PaginaCatalogoCategorias />} />
              <Route path="/categoria/:slug" element={<PaginaProcedimentos />} />
              <Route path="/login" element={<PaginaLogin />} />

              {/* Rotas Administrativas Protegidas */}
              <Route path="/admin" element={<RotaProtegida />}>
                <Route element={<LayoutAdmin />}>
                  <Route index element={<Navigate to="/admin/categorias" replace />} />
                  <Route path="categorias" element={<PaginaAdminCategorias />} />
                  <Route path="categorias/:categoriaSlug" element={<PaginaAdminServicos />} />
                  <Route path="avaliacoes" element={<PaginaAdminAvaliacoes />} />
                  <Route path="configuracoes" element={<PaginaAdminConfig />} />
                </Route>
              </Route>

              {/* Fallback de rotas desconhecidas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ProvedorCarrinho>
      </ProvedorCatalogo>
    </ProvedorAutenticacao>
  );
}
export default App;
