import React from 'react';
import { Link } from 'react-router-dom';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useAutenticacao } from '../../hooks/useAutenticacao';

export function CabecalhoMarca() {
  const { configuracoes } = useCatalogo();
  const { estaAutenticado } = useAutenticacao();

  const nomeNegocio = configuracoes?.nome_negocio || 'Gabriela Passos';
  const subtitulo = configuracoes?.subtitulo || 'Maquiagem • Sobrancelhas • Estética';

  React.useEffect(() => {
    if (nomeNegocio) {
      document.title = `${nomeNegocio} | Catalogo de Serviços & Agendamento`;
    }
  }, [nomeNegocio]);

  return (
    <header className="brand-header">
      <div className="brand-header-top">
        <Link
          to={estaAutenticado ? '/admin/categorias' : '/login'}
          className="brand-logo-link"
          aria-label={estaAutenticado ? 'Acessar Painel Administrativo' : 'Área da Profissional (Login)'}
          title={estaAutenticado ? 'Painel Administrativo' : 'Área da Profissional'}
        >
          <img
            src="/images/I0H9wR3zSyPLDxG8mdDg_XMQUab25GgxFIX1c.jpg"
            alt={`Logo ${nomeNegocio}`}
            className="brand-icon-lips"
          />
        </Link>
      </div>

      <h1 className="brand-title">{nomeNegocio}</h1>
      <p className="brand-subtitle">{subtitulo}</p>
    </header>
  );
}

