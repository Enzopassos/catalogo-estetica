import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CabecalhoMarca } from '../components/comum/CabecalhoMarca';
import { Rodape } from '../components/comum/Rodape';
import { BarraNavegacaoCategorias } from '../components/catalogo/BarraNavegacaoCategorias';
import { CardServico } from '../components/catalogo/CardServico';
import { BarraCarrinhoFlutuante } from '../components/catalogo/BarraCarrinhoFlutuante';
import { ModalAgendamentoWhatsApp } from '../components/catalogo/ModalAgendamentoWhatsApp';
import { SkeletonCardServico } from '../components/comum/SkeletonCard';
import { BarraPesquisa } from '../components/catalogo/BarraPesquisa';
import { useCatalogo } from '../hooks/useCatalogo';

export function PaginaProcedimentos() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorias, servicos, carregando } = useCatalogo();

  const buscaInicial = searchParams.get('busca') || '';
  const [termoBusca, setTermoBusca] = useState(buscaInicial);

  const categoriaAtual = categorias.find(c => c.slug === slug);
  const nomeCategoria = slug === 'todos' ? 'Todos os Procedimentos' : (categoriaAtual?.nome || 'Procedimentos');
  const tagCategoria = slug === 'todos' ? 'Catálogo Completo' : (categoriaAtual?.nome || 'Catálogo');

  function lidarComMudancaBusca(novoTermo) {
    setTermoBusca(novoTermo);
    if (novoTermo.trim()) {
      setSearchParams({ busca: novoTermo }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  function lidarComLimparBusca() {
    setTermoBusca('');
    setSearchParams({}, { replace: true });
  }

  const termoNormalizado = termoBusca.toLowerCase().trim();

  const servicosFiltrados = servicos.filter(s => {
    if (!s.ativo) return false;
    const pertenceCategoria = slug === 'todos' || s.categoria_slug === slug;
    if (!pertenceCategoria) return false;
    if (!termoNormalizado) return true;

    const titulo = s.titulo ? s.titulo.toLowerCase() : '';
    const desc = s.descricao ? s.descricao.toLowerCase() : '';
    return titulo.includes(termoNormalizado) || desc.includes(termoNormalizado);
  });

  return (
    <div className="app-container">
      <CabecalhoMarca />

      <BarraNavegacaoCategorias categoriaAtualSlug={slug} />

      <main className="section">
        <Link to="/" className="btn-back-categories touch-active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Voltar para Categorias</span>
        </Link>

        <div className="section-title-wrap">
          <span className="section-tag">{tagCategoria}</span>
          <h2 className="headline-md">{nomeCategoria}</h2>
          <p className="body-sm" style={{ marginTop: '4px' }}>
            Selecione os procedimentos desejados para agendar pelo WhatsApp.
          </p>
        </div>

        <BarraPesquisa
          valor={termoBusca}
          aoMudar={lidarComMudancaBusca}
          aoLimpar={lidarComLimparBusca}
          placeholder={`Buscar em ${nomeCategoria.toLowerCase()}...`}
        />

        {carregando ? (
          <div className="services-list" aria-busy="true" aria-label="Carregando procedimentos...">
            <SkeletonCardServico />
            <SkeletonCardServico />
          </div>
        ) : servicosFiltrados.length === 0 ? (
          <div className="search-empty-state">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', marginTop: '12px', marginBottom: '6px' }}>
              Nenhum procedimento encontrado
            </h3>
            <p className="body-sm" style={{ color: 'var(--color-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              {termoBusca
                ? `Não encontramos procedimentos contendo o termo "${termoBusca}".`
                : 'Nenhum procedimento ativo encontrado para esta área no momento.'}
            </p>
            {termoBusca && (
              <button
                type="button"
                onClick={lidarComLimparBusca}
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
            )}
          </div>
        ) : (
          <div className="services-list">
            {servicosFiltrados.map(servico => (
              <CardServico
                key={servico.id}
                servico={servico}
                nomeCategoria={categoriaAtual?.nome || 'Estética'}
              />
            ))}
          </div>
        )}
      </main>

      <Rodape />
      <BarraCarrinhoFlutuante />
      <ModalAgendamentoWhatsApp />
    </div>
  );
}
