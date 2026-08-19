import React from 'react';
import { useCatalogo } from '../../hooks/useCatalogo';

export function BannerInstagram() {
  const { configuracoes } = useCatalogo();
  const usuarioInsta = configuracoes?.instagram_usuario || 'gabriela.beauty';

  return (
    <div className="instagram-banner">
      <div className="insta-handle">@{usuarioInsta}</div>
      <p className="insta-subtitle">Acompanhe transformações reais e bastidores no Instagram</p>

      <div className="insta-grid">
        <div className="insta-grid-item">
          <img src="/images/services/makeup_glam.png" alt="Make Glam" loading="lazy" />
        </div>
        <div className="insta-grid-item">
          <img src="/images/services/brow_lamination.png" alt="Brow Lamination" loading="lazy" />
        </div>
        <div className="insta-grid-item">
          <img src="/images/services/facial_spa.png" alt="Facial Spa" loading="lazy" />
        </div>
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
