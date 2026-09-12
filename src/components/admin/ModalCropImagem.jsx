import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/**
 * Cria um elemento HTMLImageElement a partir de uma URL ou data URL
 */
function criarImagem(url) {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.addEventListener('load', () => resolve(imagem));
    imagem.addEventListener('error', (erro) => reject(erro));
    imagem.setAttribute('crossOrigin', 'anonymous');
    imagem.src = url;
  });
}

/**
 * Extrai a região recortada e gera um Blob WebP comprimido e otimizado
 */
async function obterImagemRecortada(urlImagemOriginal, recortePixels, qualidade = 0.85) {
  const imagem = await criarImagem(urlImagemOriginal);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do Canvas.');
  }

  // Define as dimensões do canvas baseadas no tamanho do recorte
  canvas.width = Math.round(recortePixels.width);
  canvas.height = Math.round(recortePixels.height);

  // Desenha o recorte no canvas
  ctx.drawImage(
    imagem,
    recortePixels.x,
    recortePixels.y,
    recortePixels.width,
    recortePixels.height,
    0,
    0,
    recortePixels.width,
    recortePixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const base64 = canvas.toDataURL('image/webp', qualidade);
        resolve({ blob, base64 });
      },
      'image/webp',
      qualidade
    );
  });
}

export function ModalCropImagem({
  aberto,
  imagemSrc,
  onConfirmar,
  onCancelar,
  aspectoInicial = 4 / 3
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspecto, setAspecto] = useState(aspectoInicial);
  const [recortePixels, setRecortePixels] = useState(null);
  const [processando, setProcessando] = useState(false);

  const aoCompletarRecorte = useCallback((_areaRecorte, areaRecortePixels) => {
    setRecortePixels(areaRecortePixels);
  }, []);

  async function handleConfirmar() {
    if (!imagemSrc || !recortePixels) return;
    setProcessando(true);
    try {
      const { blob, base64 } = await obterImagemRecortada(imagemSrc, recortePixels);
      onConfirmar({ blob, base64 });
    } catch (err) {
      console.error('Erro ao recortar imagem:', err);
      alert('Não foi possível processar o corte da imagem.');
    } finally {
      setProcessando(false);
    }
  }

  if (!aberto || !imagemSrc) return null;

  return (
    <div className="modal-crop-backdrop" role="dialog" aria-modal="true" aria-label="Ajustar e recortar foto">
      <div className="modal-crop-container">
        {/* Cabeçalho */}
        <div className="modal-crop-header">
          <div>
            <span className="section-tag" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Enquadramento</span>
            <h3 className="modal-crop-title">Ajustar e Enquadrar Foto</h3>
          </div>
          <button
            type="button"
            className="modal-crop-btn-fechar"
            onClick={onCancelar}
            disabled={processando}
            aria-label="Fechar e cancelar recorte"
          >
            ✕
          </button>
        </div>

        {/* Área do Cropper */}
        <div className="modal-crop-area-wrap">
          <Cropper
            image={imagemSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspecto || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={aoCompletarRecorte}
            showGrid={true}
          />
        </div>

        {/* Barra de Controles e Proporções */}
        <div className="modal-crop-controles">
          {/* Seletor de Aspect Ratio */}
          <div className="modal-crop-aspect-selector">
            <span className="modal-crop-control-label">Proporção:</span>
            <div className="modal-crop-chips">
              <button
                type="button"
                className={`modal-crop-chip ${aspecto === 4 / 3 ? 'active' : ''}`}
                onClick={() => setAspecto(4 / 3)}
              >
                4:3 (Padrão)
              </button>
              <button
                type="button"
                className={`modal-crop-chip ${aspecto === 16 / 9 ? 'active' : ''}`}
                onClick={() => setAspecto(16 / 9)}
              >
                16:9 (Widescreen)
              </button>
              <button
                type="button"
                className={`modal-crop-chip ${aspecto === 1 ? 'active' : ''}`}
                onClick={() => setAspecto(1)}
              >
                1:1 (Quadrado)
              </button>
              <button
                type="button"
                className={`modal-crop-chip ${aspecto === null ? 'active' : ''}`}
                onClick={() => setAspecto(null)}
              >
                Livre
              </button>
            </div>
          </div>

          {/* Slider de Zoom */}
          <div className="modal-crop-zoom-wrap">
            <span className="modal-crop-control-label">Zoom:</span>
            <div className="modal-crop-slider-row">
              <button
                type="button"
                className="btn-zoom-step"
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                aria-label="Diminuir zoom"
              >
                －
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="modal-crop-slider"
                aria-label="Ajuste fino de zoom"
              />
              <button
                type="button"
                className="btn-zoom-step"
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                aria-label="Aumentar zoom"
              >
                ＋
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="modal-crop-actions">
          <button
            type="button"
            className="btn-admin-secondary touch-active"
            onClick={onCancelar}
            disabled={processando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary-red touch-active"
            onClick={handleConfirmar}
            disabled={processando}
            style={{ padding: '10px 24px' }}
          >
            {processando ? (
              <span>Processando corte...</span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Cortar e Aplicar Foto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
