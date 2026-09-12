import React from 'react';

export function SkeletonCardCategoria() {
  return (
    <div className="skeleton-category-card" aria-hidden="true">
      <div className="skeleton-category-img skeleton-shimmer"></div>
      <div className="skeleton-category-body">
        <div>
          <div className="skeleton-text-title skeleton-shimmer"></div>
          <div className="skeleton-text-sub skeleton-shimmer"></div>
        </div>
        <div className="skeleton-circle-btn skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export function SkeletonCardServico() {
  return (
    <div className="service-card" aria-hidden="true" style={{ opacity: 0.9 }}>
      <div className="service-card-image-wrap skeleton-shimmer"></div>
      <div className="service-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div className="skeleton-text-title skeleton-shimmer" style={{ width: '60%' }}></div>
          <div className="skeleton-text-title skeleton-shimmer" style={{ width: '25%' }}></div>
        </div>
        <div className="skeleton-text-sub skeleton-shimmer" style={{ width: '40%', marginBottom: '14px' }}></div>
        <div className="skeleton-text-sub skeleton-shimmer" style={{ width: '90%', marginBottom: '8px' }}></div>
        <div className="skeleton-text-sub skeleton-shimmer" style={{ width: '70%', marginBottom: '20px' }}></div>
        <div className="skeleton-shimmer" style={{ height: '44px', width: '100%', borderRadius: '8px' }}></div>
      </div>
    </div>
  );
}
