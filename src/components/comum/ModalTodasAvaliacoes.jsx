import React from 'react';

/**
 * Formata data no formato brasileiro amigável (ex: 12 de Setembro de 2026)
 * @param {string} dataIso
 * @returns {string|null}
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

/**
 * Modal para visualização completa de todos os depoimentos aprovados pelas clientes
 * Permite leitura fluida com rolagem vertical sem poluir a homepage
 *
 * @param {Object} props
 * @param {boolean} props.aberto
 * @param {Function} props.onFechar
 * @param {Array} props.avaliacoes
 * @param {number|string} props.mediaEstrelas
 * @param {Function} props.onAbrirEnviarAvaliacao
 */
export function ModalTodasAvaliacoes({
  aberto,
  onFechar,
  avaliacoes = [],
  mediaEstrelas = '5.0',
  onAbrirEnviarAvaliacao
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar} role="dialog" aria-modal="true" aria-labelledby="titulo-modal-todas-avaliacoes">
      <div className="bottom-sheet modal-todas-avaliacoes-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle"></div>

        {/* Cabeçalho do Modal */}
        <div className="sheet-header">
          <div>
            <span className="section-tag" style={{ marginBottom: '2px' }}>Depoimentos Reais</span>
            <h3 id="titulo-modal-todas-avaliacoes" className="sheet-title">
              Avaliações das Clientes
            </h3>
            <div className="modal-todas-resumo" aria-label={`Média ${mediaEstrelas} de 5 estrelas`}>
              <span className="depoimentos-media-estrelas">★★★★★</span>
              <span className="depoimentos-media-nota">{mediaEstrelas}</span>
              <span className="depoimentos-media-contagem">
                ({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-close-modal"
            onClick={onFechar}
            aria-label="Fechar lista de avaliações"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Lista Rolável de Todas as Avaliações */}
        <div className="modal-todas-lista">
          {avaliacoes.length === 0 ? (
            <p className="modal-todas-vazia">Nenhuma avaliação aprovada no momento.</p>
          ) : (
            avaliacoes.map((item) => {
              const estrelasPreenchidas = Math.max(1, Math.min(5, Number(item.estrelas) || 5));
              const dataFormatada = formatarDataAvaliacao(item.criado_em);

              return (
                <article key={item.id} className="testimonial-card modal-todas-item">
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
            })
          )}
        </div>

        {/* Rodapé com Ação */}
        {onAbrirEnviarAvaliacao && (
          <div className="modal-todas-footer">
            <button
              type="button"
              className="btn-primary-red touch-active"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                onFechar();
                onAbrirEnviarAvaliacao();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>Deixar Minha Avaliação</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
