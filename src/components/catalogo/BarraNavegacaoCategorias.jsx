import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCatalogo } from '../../hooks/useCatalogo';

export function BarraNavegacaoCategorias({ categoriaAtualSlug }) {
  const { categorias } = useCatalogo();

  return (
    <nav className="category-nav" aria-label="Filtro de Categorias">
      <NavLink
        to="/categoria/todos"
        className={`chip ${categoriaAtualSlug === 'todos' ? 'active' : ''}`}
      >
        Todos
      </NavLink>

      {categorias.map(cat => (
        <NavLink
          key={cat.id || cat.slug}
          to={`/categoria/${cat.slug}`}
          className={`chip ${categoriaAtualSlug === cat.slug ? 'active' : ''}`}
        >
          {cat.nome}
        </NavLink>
      ))}
    </nav>
  );
}
