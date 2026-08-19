import React from 'react';

export function Rodape() {
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
      <p>© 2026 Gabriela Beauty Studio. Todos os direitos reservados.</p>
      <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
        Desenvolvido com carinho para agendamentos ágeis no WhatsApp.
      </p>
    </footer>
  );
}
