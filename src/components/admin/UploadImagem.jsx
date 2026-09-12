import React, { useState, useRef } from 'react';
import { supabase } from '../../database/clienteSupabase';

/**
 * Utilitário para redimensionar e compactar imagem no navegador (Canvas API)
 * Reduz fotos pesadas de celulares (10-15MB) para WebP/JPEG leve (~100-250kb) mantendo nitidez.
 */
function compactarImagem(arquivo, maxLargura = 1200, maxAltura = 1200, qualidade = 0.85) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.readAsDataURL(arquivo);
    leitor.onload = (evento) => {
      const img = new Image();
      img.src = evento.target.result;
      img.onload = () => {
        let largura = img.width;
        let altura = img.height;

        if (largura > altura) {
          if (largura > maxLargura) {
            altura = Math.round((altura * maxLargura) / largura);
            largura = maxLargura;
          }
        } else {
          if (altura > maxAltura) {
            largura = Math.round((largura * maxAltura) / altura);
            altura = maxAltura;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = largura;
        canvas.height = altura;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, largura, altura);

        try {
          const base64Data = canvas.toDataURL('image/webp', qualidade);
          canvas.toBlob(
            (blob) => {
              resolve({ blob: blob || arquivo, base64: base64Data });
            },
            'image/webp',
            qualidade
          );
        } catch {
          const base64Data = canvas.toDataURL('image/jpeg', qualidade);
          canvas.toBlob(
            (blob) => {
              resolve({ blob: blob || arquivo, base64: base64Data });
            },
            'image/jpeg',
            qualidade
          );
        }
      };
      img.onerror = (err) => reject(err);
    };
    leitor.onerror = (err) => reject(err);
  });
}

export function UploadImagem({
  valor = '',
  onAlterar,
  pasta = 'catalogo',
  label = 'Foto / Imagem de Capa',
  placeholderPadrao = '/images/services/facial_spa.webp'
}) {
  const [carregando, setCarregando] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [mostrarCampoUrl, setMostrarCampoUrl] = useState(false);
  const [urlManual, setUrlManual] = useState('');
  const inputRef = useRef(null);

  async function processarArquivo(arquivo) {
    if (!arquivo || !arquivo.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    setCarregando(true);
    try {
      // 1. Compacta a imagem no navegador para rapidez e alta qualidade
      const { blob, base64 } = await compactarImagem(arquivo);

      // 2. Tenta fazer upload para o Supabase Storage no bucket "catalogo"
      const nomeArquivo = `${pasta}/${Date.now()}_${arquivo.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      try {
        const { data, error } = await supabase.storage
          .from('catalogo')
          .upload(nomeArquivo, blob, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from('catalogo').getPublicUrl(data.path);
          if (urlData?.publicUrl) {
            onAlterar(urlData.publicUrl);
            setCarregando(false);
            return;
          }
        }
      } catch (storageErr) {
        console.warn('Supabase Storage indisponível, utilizando fallback em Base64 otimizado:', storageErr);
      }

      // 3. Fallback inteligente: Salva a imagem compactada em Base64 diretamente
      onAlterar(base64);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      alert('Não foi possível processar a imagem selecionada.');
    } finally {
      setCarregando(false);
    }
  }

  function handleFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      processarArquivo(files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setArrastando(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setArrastando(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setArrastando(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processarArquivo(files[0]);
    }
  }

  function handleAplicarUrlManual(e) {
    e.preventDefault();
    if (urlManual.trim()) {
      onAlterar(urlManual.trim());
      setUrlManual('');
      setMostrarCampoUrl(false);
    }
  }

  function handleRemover() {
    onAlterar('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  const imagemAtual = valor || placeholderPadrao;
  const possuiImagemPersonalizada = !!valor && valor !== placeholderPadrao;

  return (
    <div className="upload-imagem-container">
      <div className="upload-label-row">
        <label className="form-label">{label}</label>
        <button
          type="button"
          className="btn-toggle-url-mode"
          onClick={() => setMostrarCampoUrl(!mostrarCampoUrl)}
        >
          {mostrarCampoUrl ? 'Fechar link manual' : 'Inserir URL manual'}
        </button>
      </div>

      {/* Modo de Entrada Manual por Link (Opcional) */}
      {mostrarCampoUrl && (
        <div className="upload-manual-url-box">
          <input
            type="text"
            className="form-input"
            placeholder="Cole o link da imagem (ex: https://...)"
            value={urlManual}
            onChange={(e) => setUrlManual(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary-red touch-active"
            style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            onClick={handleAplicarUrlManual}
          >
            Aplicar Link
          </button>
        </div>
      )}

      {/* Input de Arquivo Oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Card Interativo de Upload / Preview */}
      <div
        className={`upload-dropzone ${arrastando ? 'dragging' : ''} ${possuiImagemPersonalizada ? 'has-image' : ''}`}
        onClick={() => !carregando && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Selecionar imagem do dispositivo"
      >
        {carregando ? (
          <div className="upload-loading-state">
            <div className="upload-spinner"></div>
            <span>Processando e enviando imagem...</span>
          </div>
        ) : possuiImagemPersonalizada ? (
          <div className="upload-preview-wrap">
            <img
              src={imagemAtual}
              alt="Pré-visualização"
              className="upload-preview-img"
              onError={(e) => {
                e.currentTarget.src = placeholderPadrao;
              }}
            />
            <div className="upload-preview-overlay">
              <div className="upload-overlay-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>Toque para Trocar Foto</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder-state">
            <div className="upload-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className="upload-placeholder-texts">
              <span className="upload-placeholder-title">
                Toque para escolher da galeria, câmera ou arquivos
              </span>
              <span className="upload-placeholder-desc">
                Formatos aceitos: JPG, PNG, WEBP (compressão automática)
              </span>
            </div>
          </div>
        )}
      </div>

      {possuiImagemPersonalizada && !carregando && (
        <div className="upload-actions-bar">
          <button
            type="button"
            className="btn-upload-action touch-active"
            onClick={() => inputRef.current?.click()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span>Trocar Imagem</span>
          </button>

          <button
            type="button"
            className="btn-upload-remove touch-active"
            onClick={handleRemover}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Remover Foto</span>
          </button>
        </div>
      )}
    </div>
  );
}
