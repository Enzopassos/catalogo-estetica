import React from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function Rodape() {
  const { configuracoes } = useCatalogo();
  const nomeNegocio = configuracoes?.nome_negocio || 'Studio de Beleza';
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="brand-footer">
      <p>© 2026 Gabriela Beauty Studio. Todos os direitos reservados.</p>
    </footer>
  );
}
