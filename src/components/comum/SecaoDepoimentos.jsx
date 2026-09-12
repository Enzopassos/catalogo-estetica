import React, { useState } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';
import { ModalEnviarAvaliacao } from './ModalEnviarAvaliacao';
import { ModalTodasAvaliacoes } from './ModalTodasAvaliacoes';

/**
 * Formata data no formato brasileiro amigável (ex: 12 de Setembro)
 */
function formatarDataAvaliacao(dataIso) {
  if (!dataIso) return null;
  try {
    const data = new Date(dataIso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(data);
  } catch {
    return null;
  }
}

export function SecaoDepoimentos() {
  const { avaliacoesAprovadas, mediaEstrelas } = useCatalogo();
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalTodasAberto, setModalTodasAberto] = useState(false);

  const temAvaliacoes = avaliacoesAprovadas && avaliacoesAprovadas.length > 0;
  // Exibe apenas as 2 avaliações mais recentes na grade inicial para não poluir a homepage
  const avaliacoesEmDestaque = temAvaliacoes ? avaliacoesAprovadas.slice(0, 2) : [];

  return (
    <section className="section-depoimentos-wrap" aria-label="Depoimentos e Avaliações de Clientes">
      {/* Cabeçalho da Seção com Botão de Avaliar */}
      <div className="depoimentos-header">
        <div className="depoimentos-header-info">
          <span className="section-tag">Depoimentos</span>
          <h2 className="headline-md">O que dizem as clientes</h2>
        </div>

        <button
          type="button"
          onClick={() => setModalAvaliacaoAberto(true)}
          className="btn-deixar-avaliacao touch-active"
          title="Compartilhe como foi seu atendimento"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Deixar Avaliação</span>
        </button>
      </div>

      {/* Grade de Depoimentos ou Estado Vazio Convidativo */}
      {temAvaliacoes ? (
        <>
          <div className="testimonials-grid">
            {avaliacoesEmDestaque.map((item) => {
              const estrelasPreenchidas = Math.max(1, Math.min(5, Number(item.estrelas) || 5));
              const dataFormatada = formatarDataAvaliacao(item.criado_em);

              return (
                <article key={item.id} className="testimonial-card">
                  <div className="testimonial-card-top">
                    <div className="testimonial-stars" aria-label={`${estrelasPreenchidas} de 5 estrelas`}>
                      {'★'.repeat(estrelasPreenchidas)}
                      {'☆'.repeat(5 - estrelasPreenchidas)}
                    </div>
                    {dataFormatada && (
                      <time className="testimonial-date" dateTime={item.criado_em}>
                        {dataFormatada}
                      </time>
                    )}
                  </div>

                  <blockquote className="testimonial-text">
                    "{item.depoimento}"
                  </blockquote>

                  <div className="testimonial-author">
                    — {item.nome_cliente}
                    {item.servico_realizado && (
                      <span className="testimonial-service-tag">
                        {' '}({item.servico_realizado})
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Botão para ver todas caso existam mais de 2 avaliações */}
          {avaliacoesAprovadas.length > 2 && (
            <div className="depoimentos-ver-mais-wrap">
              <button
                type="button"
                className="btn-ver-todas-avaliacoes touch-active"
                onClick={() => setModalTodasAberto(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Ver todas as avaliações ({avaliacoesAprovadas.length})</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="depoimentos-empty-card">
          <div className="depoimentos-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h3 className="depoimentos-empty-title">Seja a primeira a avaliar!</h3>
          <p className="depoimentos-empty-desc">
            Já realizou algum procedimento conosco? Compartilhe sua experiência e ajude outras clientes a conhecerem nosso trabalho.
          </p>
          <button
            type="button"
            onClick={() => setModalAvaliacaoAberto(true)}
            className="btn-primary-red touch-active"
            style={{ marginTop: '16px' }}
          >
            <span>+ Enviar Meu Depoimento</span>
          </button>
        </div>
      )}

      {/* Modal para Deixar Nova Avaliação */}
      <ModalEnviarAvaliacao
        aberto={modalAvaliacaoAberto}
        onFechar={() => setModalAvaliacaoAberto(false)}
      />

      {/* Modal para Visualizar Todas as Avaliações Aprovadas */}
      <ModalTodasAvaliacoes
        aberto={modalTodasAberto}
        onFechar={() => setModalTodasAberto(false)}
        avaliacoes={avaliacoesAprovadas}
        mediaEstrelas={mediaEstrelas}
        onAbrirEnviarAvaliacao={() => setModalAvaliacaoAberto(true)}
      />
    </section>
  );
}
