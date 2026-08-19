import React from 'react';
import { CabecalhoMarca } from '../components/comum/CabecalhoMarca';
import { Rodape } from '../components/comum/Rodape';
import { BannerInstagram } from '../components/comum/BannerInstagram';
import { SecaoDepoimentos } from '../components/comum/SecaoDepoimentos';
import { CardCategoria } from '../components/catalogo/CardCategoria';
import { BarraCarrinhoFlutuante } from '../components/catalogo/BarraCarrinhoFlutuante';
import { ModalAgendamentoWhatsApp } from '../components/catalogo/ModalAgendamentoWhatsApp';
import { useCatalogo } from '../hooks/useCatalogo';

export function PaginaCatalogoCategorias() {
  const { categorias, carregando } = useCatalogo();

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

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-secondary)' }}>
            Carregando categorias...
          </div>
        ) : (
          <div className="categories-grid">
            {categorias.map(cat => (
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
