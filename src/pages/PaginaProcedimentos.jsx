import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CabecalhoMarca } from '../components/comum/CabecalhoMarca';
import { Rodape } from '../components/comum/Rodape';
import { BarraNavegacaoCategorias } from '../components/catalogo/BarraNavegacaoCategorias';
import { CardServico } from '../components/catalogo/CardServico';
import { BarraCarrinhoFlutuante } from '../components/catalogo/BarraCarrinhoFlutuante';
import { ModalAgendamentoWhatsApp } from '../components/catalogo/ModalAgendamentoWhatsApp';
import { useCatalogo } from '../hooks/useCatalogo';

export function PaginaProcedimentos() {
  const { slug } = useParams();
  const { categorias, servicos, carregando } = useCatalogo();

  const categoriaAtual = categorias.find(c => c.slug === slug);
  const nomeCategoria = slug === 'todos' ? 'Todos os Procedimentos' : (categoriaAtual?.nome || 'Procedimentos');
  const tagCategoria = slug === 'todos' ? 'Catálogo Completo' : (categoriaAtual?.nome || 'Catálogo');

  const servicosFiltrados = slug === 'todos'
    ? servicos.filter(s => s.ativo)
    : servicos.filter(s => s.categoria_slug === slug && s.ativo);

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

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-secondary)' }}>
            Carregando procedimentos...
          </div>
        ) : servicosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--color-secondary)' }}>
            <p>Nenhum procedimento ativo encontrado para esta área no momento.</p>
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
