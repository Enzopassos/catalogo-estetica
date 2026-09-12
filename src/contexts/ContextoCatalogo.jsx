import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../database/clienteSupabase';

// Chave para cache local de alta performance (Stale-While-Revalidate)
const CHAVE_CACHE_CATALOGO = 'gabriela_cache_catalogo_v1';

function obterCacheInicialCatalogo() {
  try {
    const salvo = localStorage.getItem(CHAVE_CACHE_CATALOGO);
    if (salvo) {
      const parsed = JSON.parse(salvo);
      if (parsed && typeof parsed === 'object') {
        return {
          categorias: Array.isArray(parsed.categorias) ? parsed.categorias : null,
          servicos: Array.isArray(parsed.servicos) ? parsed.servicos : null,
          configuracoes: parsed.configuracoes && typeof parsed.configuracoes === 'object' ? parsed.configuracoes : null,
          avaliacoes: Array.isArray(parsed.avaliacoes) ? parsed.avaliacoes : [],
          temCache: true
        };
      }
    }
  } catch (err) {
    console.warn('Erro ao ler cache do catálogo:', err);
  }
  return { categorias: null, servicos: null, configuracoes: null, avaliacoes: [], temCache: false };
}

function salvarCacheCatalogo(dados) {
  try {
    localStorage.setItem(CHAVE_CACHE_CATALOGO, JSON.stringify({
      categorias: dados.categorias,
      servicos: dados.servicos,
      configuracoes: dados.configuracoes,
      avaliacoes: dados.avaliacoes,
      atualizado_em: Date.now()
    }));
  } catch (err) {
    console.warn('Erro ao salvar cache do catálogo no localStorage:', err);
  }
}

// Dados de contingência (Fallback) caso o banco ainda esteja inicializando ou sem conexão
const CATEGORIAS_PADRAO = [
  {
    id: 'cat-maq',
    nome: 'Maquiagem',
    slug: 'maquiagem',
    descricao: 'Social Glam, Noivas & Madrinhas',
    imagem_url: '/images/services/makeup_glam.webp',
    ordem: 1
  },
  {
    id: 'cat-sob',
    nome: 'Sobrancelha',
    slug: 'sobrancelha',
    descricao: 'Brow Lamination & Design com Henna',
    imagem_url: '/images/services/brow_lamination.webp',
    ordem: 2
  },
  {
    id: 'cat-est',
    nome: 'Estética Geral',
    slug: 'estetica',
    descricao: 'Limpeza de Pele Deep Glow & Spa Labial',
    imagem_url: '/images/services/facial_spa.webp',
    ordem: 3
  }
];

const SERVICOS_PADRAO = [
  {
    id: 'maq-social',
    titulo: 'Maquiagem Social Glam',
    categoria_slug: 'maquiagem',
    preco: 180.00,
    duracao_minutos: 60,
    descricao: 'Produção completa com técnicas de iluminação, pele blindada resistente à água e suor, cílios de alta qualidade e acabamento editorial duradouro.',
    imagem_url: '/images/services/makeup_glam.webp',
    adicionais: [
      { id: 'cilios-3d', nome: 'Cílios 3D Premium', preco: 25.00 },
      { id: 'prep-express', nome: 'Skincare Prep Glow', preco: 30.00 }
    ],
    ativo: true,
    ordem: 1
  },
  {
    id: 'maq-noiva',
    titulo: 'Maquiagem Noiva & Madrinha',
    categoria_slug: 'maquiagem',
    preco: 280.00,
    duracao_minutos: 90,
    descricao: 'Maquiagem ultra resistente com consultoria prévia de estilo, fixação HD para foto e vídeo, hidratação profunda e produtos de alta costura.',
    imagem_url: '/images/services/makeup_glam.webp',
    adicionais: [
      { id: 'kit-retoque', nome: 'Kit Retoque Batom & Pó', preco: 35.00 },
      { id: 'colo-glow', nome: 'Iluminação de Colo e Ombros', preco: 40.00 }
    ],
    ativo: true,
    ordem: 2
  },
  {
    id: 'sob-lamination',
    titulo: 'Brow Lamination + Design',
    categoria_slug: 'sobrancelha',
    preco: 130.00,
    duracao_minutos: 50,
    descricao: 'Técnica de alinhamento dos fios naturais para sobrancelhas mais encorpadas, selvagens e alinhadas. Inclui design geométrico e nutrição com vitaminas.',
    imagem_url: '/images/services/brow_lamination.webp',
    adicionais: [
      { id: 'tintura-fios', nome: 'Coloração de Fios (Refectocil)', preco: 30.00 },
      { id: 'spa-sobrancelha', nome: 'Argiloterapia Calmante', preco: 20.00 }
    ],
    ativo: true,
    ordem: 1
  },
  {
    id: 'sob-design-henna',
    titulo: 'Design Personalizado + Henna',
    categoria_slug: 'sobrancelha',
    preco: 75.00,
    duracao_minutos: 40,
    descricao: 'Mapeamento facial exclusivo de acordo com visagismo, remoção precisa de fios com pinça/linha e aplicação de henna natural sob medida.',
    imagem_url: '/images/services/brow_lamination.webp',
    adicionais: [
      { id: 'nutricao-fios', nome: 'Nutrição com Óleo de Rícino Pure', preco: 15.00 }
    ],
    ativo: true,
    ordem: 2
  },
  {
    id: 'est-limpeza-pele',
    titulo: 'Limpeza de Pele Deep Glow',
    categoria_slug: 'estetica',
    preco: 150.00,
    duracao_minutos: 75,
    descricao: 'Protocolo de higienização profunda, emoliência sem dor, extração de cravos, peeling ultrassônico, máscara calmante e fototerapia LED.',
    imagem_url: '/images/services/facial_spa.webp',
    adicionais: [
      { id: 'mascara-ouro', nome: 'Máscara Hidratante Ouro 24k', preco: 45.00 },
      { id: 'massagem-jade', nome: 'Massagem Facial com Roller Jade', preco: 25.00 }
    ],
    ativo: true,
    ordem: 1
  },
  {
    id: 'est-spa-labial',
    titulo: 'Hydra Gloss & Spa Labial',
    categoria_slug: 'estetica',
    preco: 90.00,
    duracao_minutos: 35,
    descricao: 'Tratamento regenerador intensivo com microagulhamento de ácido hialurônico e esfoliação suave. Remove pelinhas, hidrata profundamente e proporciona efeito pump volumoso natural.',
    imagem_url: '/images/services/facial_spa.webp',
    adicionais: [
      { id: 'gloss-homecare', nome: 'Gloss Regenerador Homecare', preco: 35.00 }
    ],
    ativo: true,
    ordem: 2
  }
];

const CONFIG_PADRAO = {
  nome_negocio: 'Gabriela Passos',
  subtitulo: 'Maquiagem • Sobrancelhas • Estética',
  whatsapp_numero: '5511999999999',
  instagram_usuario: 'gabriela.beauty',
  logo_url: '/images/logo.jpg',
  fotos_instagram: [
    '/images/services/makeup_glam.webp',
    '/images/services/brow_lamination.webp',
    '/images/services/facial_spa.webp'
  ]
};

/**
 * Utilitário para garantir que caminhos de imagem locais comecem com barra '/'
 */
function normalizarImagemUrl(url, fallback = '/images/services/facial_spa.png') {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  const urlLimpa = url.trim();
  if (urlLimpa.startsWith('images/')) {
    return `/${urlLimpa}`;
  }
  return urlLimpa;
}

const ContextoCatalogo = createContext(null);

export function ProvedorCatalogo({ children }) {
  // Inicialização com cache local para exibição instantânea (0ms)
  const cacheRef = useRef(obterCacheInicialCatalogo());
  const cache = cacheRef.current;

  const [categorias, setCategorias] = useState(() => cache.categorias || CATEGORIAS_PADRAO);
  const [servicos, setServicos] = useState(() => cache.servicos || SERVICOS_PADRAO);
  const [configuracoes, setConfiguracoes] = useState(() => cache.configuracoes || CONFIG_PADRAO);
  const [avaliacoes, setAvaliacoes] = useState(() => cache.avaliacoes || []);
  
  // Se já temos cache, a interface carrega instantaneamente sem tela de loading
  const [carregando, setCarregando] = useState(!cache.temCache);

  // Sincronização em background com Supabase (Stale-While-Revalidate)
  const carregarDados = useCallback(async (forcarExibicaoCarregando = false) => {
    if (forcarExibicaoCarregando) {
      setCarregando(true);
    }
    try {
      const [resCat, resServ, resConf, resAval] = await Promise.allSettled([
        supabase.from('catalogo_categorias').select('*').order('ordem', { ascending: true }),
        supabase.from('catalogo_servicos').select('*').order('ordem', { ascending: true }),
        supabase.from('catalogo_configuracoes').select('*').order('atualizado_em', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('catalogo_avaliacoes').select('*').order('criado_em', { ascending: false })
      ]);

      let novasCats = null;
      let novosServs = null;
      let novasConfs = null;
      let novasAvals = null;

      // 1. Categorias
      if (resCat.status === 'fulfilled' && !resCat.value?.error && Array.isArray(resCat.value?.data)) {
        novasCats = resCat.value.data;
        setCategorias(novasCats);
      } else if (!cache.temCache) {
        setCategorias(CATEGORIAS_PADRAO);
      }

      // 2. Serviços
      if (resServ.status === 'fulfilled' && !resServ.value?.error && Array.isArray(resServ.value?.data)) {
        novosServs = resServ.value.data;
        setServicos(novosServs);
      } else if (!cache.temCache) {
        setServicos(SERVICOS_PADRAO);
      }

      // 3. Configurações
      if (resConf.status === 'fulfilled' && !resConf.value?.error && resConf.value?.data) {
        novasConfs = resConf.value.data;
        setConfiguracoes(novasConfs);
      } else if (!cache.temCache) {
        setConfiguracoes(CONFIG_PADRAO);
      }

      // 4. Avaliações (Respeita RLS: anônimos recebem aprovadas, admin recebe todas)
      if (resAval.status === 'fulfilled' && !resAval.value?.error && Array.isArray(resAval.value?.data)) {
        novasAvals = resAval.value.data;
        setAvaliacoes(novasAvals);
      }

      // Atualiza o cache local com os dados mais recentes do banco
      salvarCacheCatalogo({
        categorias: novasCats || cache.categorias || CATEGORIAS_PADRAO,
        servicos: novosServs || cache.servicos || SERVICOS_PADRAO,
        configuracoes: novasConfs || cache.configuracoes || CONFIG_PADRAO,
        avaliacoes: novasAvals !== null ? novasAvals : (cache.avaliacoes || [])
      });
    } catch (e) {
      console.warn('Falha na sincronização em background com o Supabase:', e);
    } finally {
      setCarregando(false);
    }
  }, [cache]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Contagem de serviços por categoria
  const categoriasComContagem = categorias.map(cat => ({
    ...cat,
    quantidade_servicos: servicos.filter(s => s.categoria_slug === cat.slug && s.ativo).length
  }));

  // Avaliações Aprovadas (para o catálogo público)
  const avaliacoesAprovadas = avaliacoes.filter(av => av.aprovado === true);

  // Avaliações Pendentes (para moderação no painel administrativo)
  const avaliacoesPendentes = avaliacoes.filter(av => !av.aprovado);
  const quantidadeAvaliacoesPendentes = avaliacoesPendentes.length;

  // Cálculo da média de estrelas
  const mediaEstrelas = avaliacoesAprovadas.length > 0
    ? (avaliacoesAprovadas.reduce((acc, curr) => acc + (Number(curr.estrelas) || 5), 0) / avaliacoesAprovadas.length).toFixed(1)
    : '5.0';

  // =========================================================================
  // CRUD CATEGORIAS
  // =========================================================================
  async function criarCategoria(dados) {
    const slug = dados.slug || dados.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');
    const payload = {
      nome: dados.nome.trim(),
      slug,
      descricao: dados.descricao?.trim() || '',
      imagem_url: dados.imagem_url?.trim() || '/images/services/facial_spa.webp',
      ordem: Number(dados.ordem) || (categorias.length + 1)
    };

    const { data, error } = await supabase.from('catalogo_categorias').insert([payload]).select().single();
    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function atualizarCategoria(id, dados) {
    const { data, error } = await supabase
      .from('catalogo_categorias')
      .update({
        nome: dados.nome.trim(),
        slug: dados.slug,
        descricao: dados.descricao?.trim() || '',
        imagem_url: normalizarImagemUrl(dados.imagem_url, '/images/services/facial_spa.png'),
        ordem: Number(dados.ordem) || 0,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function excluirCategoria(id) {
    const { error } = await supabase.from('catalogo_categorias').delete().eq('id', id);
    if (error) throw error;
    await carregarDados();
  }

  // =========================================================================
  // CRUD SERVIÇOS / PROCEDIMENTOS
  // =========================================================================
  async function criarServico(dados) {
    const payload = {
      categoria_id: dados.categoria_id || null,
      categoria_slug: dados.categoria_slug,
      titulo: dados.titulo.trim(),
      descricao: dados.descricao?.trim() || '',
      preco: Number(dados.preco) || 0,
      duracao_minutos: Number(dados.duracao_minutos) || 30,
      imagem_url: dados.imagem_url?.trim() || '/images/services/makeup_glam.webp',
      adicionais: dados.adicionais || [],
      ativo: dados.ativo !== undefined ? dados.ativo : true,
      ordem: Number(dados.ordem) || (servicos.length + 1)
    };

    const { data, error } = await supabase.from('catalogo_servicos').insert([payload]).select().single();
    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function atualizarServico(id, dados) {
    const { data, error } = await supabase
      .from('catalogo_servicos')
      .update({
        categoria_id: dados.categoria_id || null,
        categoria_slug: dados.categoria_slug,
        titulo: dados.titulo.trim(),
        descricao: dados.descricao?.trim() || '',
        preco: Number(dados.preco) || 0,
        duracao_minutos: Number(dados.duracao_minutos) || 30,
        imagem_url: dados.imagem_url?.trim() || '/images/services/makeup_glam.webp',
        adicionais: dados.adicionais || [],
        ativo: dados.ativo !== undefined ? dados.ativo : true,
        ordem: Number(dados.ordem) || 0,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function alternarStatusServico(id, statusAtual) {
    const servico = servicos.find(s => s.id === id);
    if (!servico) return;
    await atualizarServico(id, { ...servico, ativo: !statusAtual });
  }

  async function excluirServico(id) {
    const { error } = await supabase.from('catalogo_servicos').delete().eq('id', id);
    if (error) throw error;
    await carregarDados();
  }

  // =========================================================================
  // CONFIGURAÇÕES GERAIS (Garante UPDATE / Substituição do Registro)
  // =========================================================================
  async function salvarConfiguracoes(dados) {
    // 1. Identifica o ID da configuração a atualizar
    let configId = configuracoes?.id;

    if (!configId) {
      // Busca se já existe algum registro no banco para atualizar
      const { data: existente } = await supabase
        .from('catalogo_configuracoes')
        .select('id')
        .order('atualizado_em', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existente?.id) {
        configId = existente.id;
      }
    }

    const payload = {
      nome_negocio: dados.nome_negocio?.trim() || 'Gabriela Passos',
      subtitulo: dados.subtitulo?.trim() || 'Maquiagem • Sobrancelhas • Estética',
      whatsapp_numero: dados.whatsapp_numero ? dados.whatsapp_numero.replace(/\D/g, '') : '',
      instagram_usuario: dados.instagram_usuario ? dados.instagram_usuario.replace('@', '').trim() : '',
      fotos_instagram: Array.isArray(dados.fotos_instagram)
        ? dados.fotos_instagram
        : (configuracoes?.fotos_instagram || CONFIG_PADRAO.fotos_instagram),
      atualizado_em: new Date().toISOString()
    };

    if (configId) {
      const { data, error } = await supabase
        .from('catalogo_configuracoes')
        .update(payload)
        .eq('id', configId)
        .select()
        .single();

      if (error) throw error;
      await carregarDados();
      return data;
    } else {
      // Se não havia nenhum registro no banco, insere o primeiro
      const { data, error } = await supabase
        .from('catalogo_configuracoes')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      await carregarDados();
      return data;
    }
  }

  // =========================================================================
  // CRUD AVALIAÇÕES (COM MODERAÇÃO)
  // =========================================================================
  async function enviarAvaliacao(dados) {
    if (!dados.nome_cliente || dados.nome_cliente.trim().length < 2) {
      throw new Error('Por favor, informe seu nome completo ou como prefere ser chamada (mínimo 2 caracteres).');
    }
    if (!dados.depoimento || dados.depoimento.trim().length < 5) {
      throw new Error('Por favor, escreva seu depoimento (mínimo 5 caracteres).');
    }

    const estrelas = Math.max(1, Math.min(5, Number(dados.estrelas) || 5));

    const payload = {
      nome_cliente: dados.nome_cliente.trim(),
      estrelas,
      depoimento: dados.depoimento.trim(),
      servico_realizado: dados.servico_realizado?.trim() || null,
      aprovado: false
    };

    const { error } = await supabase
      .from('catalogo_avaliacoes')
      .insert([payload]);

    if (error) throw error;
    await carregarDados();
    return true;
  }

  async function aprovarAvaliacao(id) {
    const { data, error } = await supabase
      .from('catalogo_avaliacoes')
      .update({ aprovado: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function desaprovarAvaliacao(id) {
    const { data, error } = await supabase
      .from('catalogo_avaliacoes')
      .update({ aprovado: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await carregarDados();
    return data;
  }

  async function excluirAvaliacao(id) {
    const { error } = await supabase
      .from('catalogo_avaliacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await carregarDados();
  }

  return (
    <ContextoCatalogo.Provider
      value={{
        categorias: categoriasComContagem,
        servicos,
        configuracoes,
        avaliacoes,
        avaliacoesAprovadas,
        avaliacoesPendentes,
        quantidadeAvaliacoesPendentes,
        mediaEstrelas,
        carregando,
        recarregar: carregarDados,
        criarCategoria,
        atualizarCategoria,
        excluirCategoria,
        criarServico,
        atualizarServico,
        alternarStatusServico,
        excluirServico,
        salvarConfiguracoes,
        enviarAvaliacao,
        aprovarAvaliacao,
        desaprovarAvaliacao,
        excluirAvaliacao
      }}
    >
      {children}
    </ContextoCatalogo.Provider>
  );
}

export function useCatalogo() {
  const contexto = useContext(ContextoCatalogo);
  if (!contexto) {
    throw new Error('useCatalogo deve ser usado dentro de um ProvedorCatalogo');
  }
  return contexto;
}
