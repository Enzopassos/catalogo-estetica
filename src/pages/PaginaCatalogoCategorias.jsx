import React, { useState } from 'react';
import { CabecalhoMarca } from '../components/comum/CabecalhoMarca';
import { Rodape } from '../components/comum/Rodape';
import { BannerInstagram } from '../components/comum/BannerInstagram';
import { SecaoDepoimentos } from '../components/comum/SecaoDepoimentos';
import { CardCategoria } from '../components/catalogo/CardCategoria';
import { BarraCarrinhoFlutuante } from '../components/catalogo/BarraCarrinhoFlutuante';
import { ModalAgendamentoWhatsApp } from '../components/catalogo/ModalAgendamentoWhatsApp';
import { SkeletonCardCategoria } from '../components/comum/SkeletonCard';
import { BarraPesquisa } from '../components/catalogo/BarraPesquisa';
import { useCatalogo } from '../hooks/useCatalogo';

export function PaginaCatalogoCategorias() {
  const { categorias, servicos, carregando } = useCatalogo();
  const [termoBusca, setTermoBusca] = useState('');

  const termoNormalizado = termoBusca.toLowerCase().trim();

  // Filtragem em tempo real das categorias pelo nome, descrição ou procedimentos vinculados
  const categoriasFiltradas = categorias.filter(cat => {
    if (!termoNormalizado) return true;

    const bateuNome = cat.nome && cat.nome.toLowerCase().includes(termoNormalizado);
    const bateuDescricao = cat.descricao && cat.descricao.toLowerCase().includes(termoNormalizado);
    const bateuServicos = servicos.some(s =>
      s.ativo &&
      s.categoria_slug === cat.slug &&
      (
        (s.titulo && s.titulo.toLowerCase().includes(termoNormalizado)) ||
        (s.descricao && s.descricao.toLowerCase().includes(termoNormalizado))
      )
    );

    return bateuNome || bateuDescricao || bateuServicos;
  });

  return (
    <div className="app-container">
      <CabecalhoMarca />

      <main className="section">
        <div className="section-title-wrap">
          <span className="section-tag">Menu de Serviços</span>
          <h2 className="headline-md">Escolha a Categoria</h2>
          <p className="body-sm" style={{ marginTop: '4px' }}>
            Selecione uma área abaixo para visualizar os procedimentos disponíveis.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
          <BarraPesquisa
            valor={termoBusca}
            aoMudar={setTermoBusca}
            aoLimpar={() => setTermoBusca('')}
            placeholder="Filtrar categorias (ex: Maquiagem, Sobrancelha...)"
          />
        </form>

        {carregando ? (
          <div className="categories-grid" aria-busy="true" aria-label="Carregando categorias...">
            <SkeletonCardCategoria />
            <SkeletonCardCategoria />
            <SkeletonCardCategoria />
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="search-empty-state">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', marginTop: '12px', marginBottom: '6px' }}>
              Nenhuma categoria encontrada
            </h3>
            <p className="body-sm" style={{ color: 'var(--color-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              Não encontramos nenhuma categoria ou procedimento para o termo "{termoBusca}".
            </p>
            <button
              type="button"
              onClick={() => setTermoBusca('')}
              className="btn-select-service touch-active"
              style={{
                marginTop: '16px',
                display: 'inline-flex',
                width: 'auto',
                padding: '8px 22px',
                background: 'var(--color-primary-red)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}
            >
              Limpar Pesquisa
            </button>
          </div>
        ) : (
          <div className="categories-grid">
            {categoriasFiltradas.map(cat => (
              <CardCategoria key={cat.id || cat.slug} categoria={cat} />
            ))}
          </div>
        )}

        <BannerInstagram />
        <SecaoDepoimentos />
      </main>

      <Rodape />
      <BarraCarrinhoFlutuante />
      <ModalAgendamentoWhatsApp />
    </div>
  );
}
