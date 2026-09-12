import React, { useMemo } from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

const FOTOS_PADRAO = [
  '/images/services/makeup_glam.webp',
  '/images/services/brow_lamination.webp',
  '/images/services/facial_spa.webp'
];

export function BannerInstagram() {
  const { configuracoes } = useCatalogo();
  const usuarioInsta = configuracoes?.instagram_usuario?.replace('@', '').trim() || 'gabrielapassosbeauty';

  // Obtém as 3 fotos configuradas pela administradora com fallback seguro
  const fotosMural = useMemo(() => {
    const fotos = configuracoes?.fotos_instagram;
    if (Array.isArray(fotos) && fotos.length > 0) {
      return [
        fotos[0] || FOTOS_PADRAO[0],
        fotos[1] || FOTOS_PADRAO[1],
        fotos[2] || FOTOS_PADRAO[2]
      ];
    }
    return FOTOS_PADRAO;
  }, [configuracoes?.fotos_instagram]);

  const linkInstagram = `https://instagram.com/${usuarioInsta}`;

  return (
    <section className="instagram-banner" aria-label="Mural do Instagram">
      <div className="insta-handle">@{usuarioInsta}</div>
      <p className="insta-subtitle">Acompanhe transformações reais e bastidores no Instagram</p>

      <div className="insta-grid">
        {fotosMural.map((url, index) => (
          <a
            key={index}
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="insta-grid-item touch-active"
            title={`Ver fotos e produções no perfil @${usuarioInsta}`}
          >
            <img
              src={url}
              alt={`Produção em destaque ${index + 1} no Instagram`}
              loading="lazy"
            />
          </a>
        ))}
      </div>

      <a
        href={linkInstagram}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-select-service touch-active"
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
    </section>
  );
}
