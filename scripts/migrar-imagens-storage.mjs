import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diretorioPublic = path.resolve(__dirname, '../public/images/catalogo');

// Lê credenciais do .env
const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function sanitizarNomeArquivo(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
}

function extrairBufferBase64(base64Str) {
  const match = base64Str.match(/^data:(image\/[a-zA-Z0-9.+]+);base64,(.+)$/s);
  if (!match) return null;
  const mimeType = match[1];
  const extensao = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
  const buffer = Buffer.from(match[2], 'base64');
  return { buffer, mimeType, extensao };
}

async function migrar() {
  console.log('🚀 Iniciando migração e desinchaço das imagens do banco de dados...\n');

  // Garante diretórios locais em public/images/catalogo/
  const dirServicos = path.join(diretorioPublic, 'servicos');
  const dirCategorias = path.join(diretorioPublic, 'categorias');
  fs.mkdirSync(dirServicos, { recursive: true });
  fs.mkdirSync(dirCategorias, { recursive: true });

  // Verifica se o bucket 'catalogo' está ativo no Supabase Storage
  let temBucketStorage = false;
  try {
    const { data, error } = await supabase.storage.getBucket('catalogo');
    if (!error && data) {
      temBucketStorage = true;
      console.log('✅ Bucket "catalogo" encontrado no Supabase Storage! Uploads serão enviados para a CDN.');
    } else {
      console.log('ℹ️ Bucket "catalogo" ainda não criado no Supabase Storage. As imagens serão salvas em public/images/catalogo e referenciadas localmente com máxima performance.');
    }
  } catch {
    temBucketStorage = false;
  }

  // 1. MIGRAR SERVIÇOS
  console.log('\n📦 Processando serviços...');
  const { data: servicos, error: errServicos } = await supabase
    .from('catalogo_servicos')
    .select('id, titulo, imagem_url');

  if (errServicos) {
    console.error('Erro ao buscar serviços:', errServicos);
  } else {
    let servicosMigrados = 0;
    for (const servico of servicos) {
      if (servico.imagem_url && servico.imagem_url.startsWith('data:image')) {
        const extraido = extrairBufferBase64(servico.imagem_url);
        if (extraido) {
          const nomeArquivo = `${sanitizarNomeArquivo(servico.titulo)}_${servico.id.slice(0, 8)}.${extraido.extensao}`;
          const caminhoLocal = path.join(dirServicos, nomeArquivo);

          // Salva arquivo localmente
          fs.writeFileSync(caminhoLocal, extraido.buffer);

          let urlFinal = `/images/catalogo/servicos/${nomeArquivo}`;

          // Se o bucket existir no Storage, faz upload
          if (temBucketStorage) {
            const caminhoStorage = `servicos/${nomeArquivo}`;
            const { error: errUpload } = await supabase.storage
              .from('catalogo')
              .upload(caminhoStorage, extraido.buffer, {
                contentType: extraido.mimeType,
                upsert: true
              });

            if (!errUpload) {
              const { data: urlData } = supabase.storage.from('catalogo').getPublicUrl(caminhoStorage);
              if (urlData?.publicUrl) {
                urlFinal = urlData.publicUrl;
              }
            }
          }

          // Atualiza registro no banco
          const { error: errUpdate } = await supabase
            .from('catalogo_servicos')
            .update({ imagem_url: urlFinal })
            .eq('id', servico.id);

          if (errUpdate) {
            console.error(`❌ Erro ao atualizar serviço "${servico.titulo}":`, errUpdate.message);
          } else {
            console.log(`  ✓ Serviço "${servico.titulo}" -> ${urlFinal} (salvo ${(extraido.buffer.length / 1024).toFixed(1)} KB)`);
            servicosMigrados++;
          }
        }
      }
    }
    console.log(`✨ Serviços concluídos: ${servicosMigrados} imagens convertidas de Base64 para URLs leves.`);
  }

  // 2. MIGRAR CATEGORIAS
  console.log('\n📁 Processando categorias...');
  const { data: categorias, error: errCategorias } = await supabase
    .from('catalogo_categorias')
    .select('id, nome, imagem_url');

  if (errCategorias) {
    console.error('Erro ao buscar categorias:', errCategorias);
  } else {
    let categoriasMigradas = 0;
    for (const categoria of categorias) {
      if (categoria.imagem_url && categoria.imagem_url.startsWith('data:image')) {
        const extraido = extrairBufferBase64(categoria.imagem_url);
        if (extraido) {
          const nomeArquivo = `${sanitizarNomeArquivo(categoria.nome)}_${categoria.id.slice(0, 8)}.${extraido.extensao}`;
          const caminhoLocal = path.join(dirCategorias, nomeArquivo);

          fs.writeFileSync(caminhoLocal, extraido.buffer);

          let urlFinal = `/images/catalogo/categorias/${nomeArquivo}`;

          if (temBucketStorage) {
            const caminhoStorage = `categorias/${nomeArquivo}`;
            const { error: errUpload } = await supabase.storage
              .from('catalogo')
              .upload(caminhoStorage, extraido.buffer, {
                contentType: extraido.mimeType,
                upsert: true
              });

            if (!errUpload) {
              const { data: urlData } = supabase.storage.from('catalogo').getPublicUrl(caminhoStorage);
              if (urlData?.publicUrl) {
                urlFinal = urlData.publicUrl;
              }
            }
          }

          const { error: errUpdate } = await supabase
            .from('catalogo_categorias')
            .update({ imagem_url: urlFinal })
            .eq('id', categoria.id);

          if (errUpdate) {
            console.error(`❌ Erro ao atualizar categoria "${categoria.nome}":`, errUpdate.message);
          } else {
            console.log(`  ✓ Categoria "${categoria.nome}" -> ${urlFinal} (salvo ${(extraido.buffer.length / 1024).toFixed(1)} KB)`);
            categoriasMigradas++;
          }
        }
      }
    }
    console.log(`✨ Categorias concluídas: ${categoriasMigradas} imagens convertidas de Base64 para URLs leves.`);
  }

  console.log('\n🎉 Migração finalizada com sucesso! O banco agora trafega apenas URLs leves.');
}

migrar().catch(err => {
  console.error('Erro fatal na migração:', err);
  process.exit(1);
});
