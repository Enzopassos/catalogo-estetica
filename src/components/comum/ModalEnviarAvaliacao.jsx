import React, { useState } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

const LABELS_ESTRELAS = {
  1: 'Muito insatisfeita',
  2: 'Poderia ser melhor',
  3: 'Bom',
  4: 'Muito bom!',
  5: 'Excelente / Encantada!'
};

/**
 * Modal elegante para clientes enviarem suas avaliações
 * @param {Object} props
 * @param {boolean} props.aberto
 * @param {Function} props.onFechar
 */
export function ModalEnviarAvaliacao({ aberto, onFechar }) {
  const { enviarAvaliacao, categorias, servicos } = useCatalogo();

  const [nomeCliente, setNomeCliente] = useState('');
  const [estrelas, setEstrelas] = useState(5);
  const [estrelasHover, setEstrelasHover] = useState(0);
  const [servicoRealizado, setServicoRealizado] = useState('');
  const [depoimento, setDepoimento] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  if (!aberto) return null;

  function resetarFormulario() {
    setNomeCliente('');
    setEstrelas(5);
    setEstrelasHover(0);
    setServicoRealizado('');
    setDepoimento('');
    setSucesso(false);
    setMensagemErro('');
  }

  function lidarComFechamento() {
    if (enviando) return;
    resetarFormulario();
    onFechar();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagemErro('');

    // Validações Fail-Fast
    const nomeLimpo = nomeCliente.trim();
    if (nomeLimpo.length < 2) {
      setMensagemErro('Por favor, informe seu nome (pelo menos 2 caracteres).');
      return;
    }

    const depoimentoLimpo = depoimento.trim();
    if (depoimentoLimpo.length < 5) {
      setMensagemErro('Por favor, escreva um depoimento com pelo menos 5 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      await enviarAvaliacao({
        nome_cliente: nomeLimpo,
        estrelas,
        depoimento: depoimentoLimpo,
        servico_realizado: servicoRealizado.trim() || null
      });

      setSucesso(true);
      setTimeout(() => {
        lidarComFechamento();
      }, 3200);
    } catch (err) {
      console.error('Erro ao submeter avaliação:', err);
      setMensagemErro(err.message || 'Houve um erro ao enviar sua avaliação. Verifique a conexão e tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  const notaAtiva = estrelasHover || estrelas;

  return (
    <div className="modal-overlay" onClick={lidarComFechamento}>
      <div className="bottom-sheet modal-avaliacao-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle"></div>

        <div className="sheet-header">
          <div>
            <span className="section-tag" style={{ marginBottom: '2px' }}>Sua Opinião Importa</span>
            <h3 className="sheet-title">Deixar Avaliação</h3>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={lidarComFechamento}
            aria-label="Fechar modal de avaliação"
            disabled={enviando}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {sucesso ? (
          <div className="avaliacao-sucesso-container" aria-live="polite">
            <div className="avaliacao-sucesso-icone-wrap">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>

            <h4 className="avaliacao-sucesso-titulo">Muito obrigada pelo carinho!</h4>
            <p className="avaliacao-sucesso-mensagem">
              Sua avaliação foi enviada com sucesso! Ela passará por uma rápida validação da nossa equipe e em breve estará visível no catálogo.
            </p>

            <button
              type="button"
              className="btn-primary-red touch-active"
              style={{ marginTop: '18px', width: '100%', maxWidth: '240px' }}
              onClick={lidarComFechamento}
            >
              <span>Concluir</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-avaliacao">
            {/* Seletor de Estrelas Interativo */}
            <div className="form-group-rating">
              <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '8px' }}>
                Como foi sua experiência geral? *
              </label>
              <div className="rating-stars-input" role="radiogroup" aria-label="Avaliação em estrelas">
                {[1, 2, 3, 4, 5].map((num) => {
                  const preenchida = num <= notaAtiva;
                  return (
                    <button
                      key={num}
                      type="button"
                      className={`star-select-btn touch-active ${preenchida ? 'active' : ''}`}
                      onClick={() => setEstrelas(num)}
                      onMouseEnter={() => setEstrelasHover(num)}
                      onMouseLeave={() => setEstrelasHover(0)}
                      aria-label={`${num} ${num === 1 ? 'estrela' : 'estrelas'}`}
                      role="radio"
                      aria-checked={estrelas === num}
                    >
                      <svg width="30" height="30" viewBox="0 0 24 24" fill={preenchida ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  );
                })}
              </div>
              <div className="rating-label-feedback">
                {LABELS_ESTRELAS[notaAtiva]}
              </div>
            </div>

            {/* Nome da Cliente */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label htmlFor="inputNomeCliente" className="form-label">
                Seu Nome ou Como Prefere Ser Chamada *
              </label>
              <input
                id="inputNomeCliente"
                type="text"
                className="form-input"
                placeholder="Ex: Marina Alencar"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                maxLength={80}
                required
                disabled={enviando}
              />
            </div>

            {/* Procedimento Realizado (Select) */}
            <div className="form-group">
              <label htmlFor="selectServicoRealizado" className="form-label">
                Procedimento Realizado <span style={{ color: 'var(--color-secondary)', fontWeight: 'normal' }}>(Opcional)</span>
              </label>
              <select
                id="selectServicoRealizado"
                className="form-input form-select"
                value={servicoRealizado}
                onChange={(e) => setServicoRealizado(e.target.value)}
                disabled={enviando}
              >
                <option value="">Selecione o procedimento realizado (opcional)</option>
                {categorias && categorias.map((cat) => {
                  const servicosDaCat = servicos ? servicos.filter(s => s.categoria_slug === cat.slug && s.ativo) : [];
                  if (servicosDaCat.length > 0) {
                    return (
                      <optgroup key={cat.id || cat.slug} label={cat.nome}>
                        {servicosDaCat.map((serv) => (
                          <option key={serv.id} value={serv.titulo}>
                            {serv.titulo}
                          </option>
                        ))}
                      </optgroup>
                    );
                  }
                  return (
                    <option key={cat.id || cat.slug} value={cat.nome}>
                      {cat.nome}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Depoimento / Comentário */}
            <div className="form-group">
              <label htmlFor="inputDepoimento" className="form-label">
                Seu Depoimento / Mensagem *
              </label>
              <textarea
                id="inputDepoimento"
                className="form-input"
                rows={3}
                placeholder="Conte o que você mais gostou no atendimento, durabilidade, resultado da pele..."
                value={depoimento}
                onChange={(e) => setDepoimento(e.target.value)}
                maxLength={500}
                required
                disabled={enviando}
              ></textarea>
              <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--color-secondary)', marginTop: '4px' }}>
                {depoimento.length}/500 caracteres
              </div>
            </div>

            {/* Mensagem de Erro, se houver */}
            {mensagemErro && (
              <div className="avaliacao-erro-aviso" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{mensagemErro}</span>
              </div>
            )}

            {/* Aviso de Moderação */}
            <div className="avaliacao-aviso-moderacao">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Para garantir a segurança de todas as clientes, sua avaliação será revisada antes de ser publicada.</span>
            </div>

            {/* Ações */}
            <div className="avaliacao-form-actions">
              <button
                type="button"
                className="btn-admin-secondary touch-active"
                onClick={lidarComFechamento}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary-red touch-active"
                disabled={enviando}
              >
                {enviando ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Enviar Avaliação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
