import React from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function BannerInstagram() {
  const { configuracoes, servicos, categorias } = useCatalogo();
  const usuarioInsta = configuracoes?.instagram_usuario?.replace('@', '').trim() || 'gabrielapassosbeauty';

  // Obter até 3 imagens distintas dos serviços ou categorias do banco
  const imagensDinamicas = React.useMemo(() => {
    const fotos = [];
    servicos.forEach(s => {
      if (s.imagem_url && !fotos.includes(s.imagem_url) && fotos.length < 3) {
        fotos.push(s.imagem_url);
      }
    });
    if (fotos.length < 3) {
      categorias.forEach(c => {
        if (c.imagem_url && !fotos.includes(c.imagem_url) && fotos.length < 3) {
          fotos.push(c.imagem_url);
        }
      });
    }
    const fallbacks = [
      '/images/services/makeup_glam.png',
      '/images/services/brow_lamination.png',
      '/images/services/facial_spa.png'
    ];
    while (fotos.length < 3) {
      fotos.push(fallbacks[fotos.length]);
    }
    return fotos;
  }, [servicos, categorias]);

  return (
    <div className="instagram-banner">
      <div className="insta-handle">@{usuarioInsta}</div>
      <p className="insta-subtitle">Acompanhe transformações reais e bastidores no Instagram</p>

      <div className="insta-grid">
        {imagensDinamicas.map((url, idx) => (
          <div key={idx} className="insta-grid-item">
            <img
              src={url}
              alt={`Galeria ${idx + 1}`}
              loading="lazy"
              onError={(e) => {
                const padrao = ['/images/services/makeup_glam.png', '/images/services/brow_lamination.png', '/images/services/facial_spa.png'];
                e.currentTarget.src = padrao[idx] || '/images/services/facial_spa.png';
              }}
            />
          </div>
        ))}
      </div>

      <a
        href={`https://instagram.com/${usuarioInsta}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-select-service"
        style={{
          background: '#ffffff',
          color: 'var(--color-primary-red)',
          border: '1px solid rgba(182, 26, 0, 0.3)',
          fontWeight: '700'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        <span>Ver no Instagram</span>
      </a>
    </div>
  );
}
