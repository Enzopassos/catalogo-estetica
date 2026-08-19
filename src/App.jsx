import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './contexts/ContextoAutenticacao';
import { ProvedorCatalogo } from './contexts/ContextoCatalogo';
import { ProvedorCarrinho } from './contexts/ContextoCarrinho';

// Páginas Públicas
import { PaginaCatalogoCategorias } from './pages/PaginaCatalogoCategorias';
import { PaginaProcedimentos } from './pages/PaginaProcedimentos';
import { PaginaLogin } from './pages/PaginaLogin';

// Componentes Administrativos
import { RotaProtegida } from './components/admin/RotaProtegida';
import { LayoutAdmin } from './components/admin/LayoutAdmin';
import { PaginaAdminCategorias } from './pages/admin/PaginaAdminCategorias';
import { PaginaAdminServicos } from './pages/admin/PaginaAdminServicos';
import { PaginaAdminConfig } from './pages/admin/PaginaAdminConfig';

export function App() {
  return (
    <ProvedorAutenticacao>
      <ProvedorCatalogo>
        <ProvedorCarrinho>
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
                <Route path="configuracoes" element={<PaginaAdminConfig />} />
              </Route>
            </Route>

            {/* Fallback de rotas desconhecidas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProvedorCarrinho>
      </ProvedorCatalogo>
    </ProvedorAutenticacao>
  );
}
export default App;
