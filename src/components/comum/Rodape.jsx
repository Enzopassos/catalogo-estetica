import React from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function Rodape() {
  const { configuracoes } = useCatalogo();
  const nomeNegocio = configuracoes?.nome_negocio || 'Studio de Beleza';
  const anoAtual = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: '24px var(--margin-mobile)',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border-light)',
        fontSize: '0.8rem',
        color: 'var(--color-secondary)'
      }}
    >
      <p>© {anoAtual} {nomeNegocio}. Todos os direitos reservados.</p>
      <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
        Desenvolvido com carinho para agendamentos ágeis no WhatsApp.
      </p>
    </footer>
  );
}
