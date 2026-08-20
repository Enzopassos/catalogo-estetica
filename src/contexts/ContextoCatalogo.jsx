import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../database/clienteSupabase';

// Dados de contingência (Fallback) caso o banco ainda esteja inicializando
const CATEGORIAS_PADRAO = [
  {
    id: 'cat-maq',
    nome: 'Maquiagem',
    slug: 'maquiagem',
    descricao: 'Social Glam, Noivas & Madrinhas',
    imagem_url: '/images/services/makeup_glam.png',
    ordem: 1
  },
  {
    id: 'cat-sob',
    nome: 'Sobrancelha',
    slug: 'sobrancelha',
    descricao: 'Brow Lamination & Design com Henna',
    imagem_url: '/images/services/brow_lamination.png',
    ordem: 2
  },
  {
    id: 'cat-est',
    nome: 'Estética Geral',
    slug: 'estetica',
    descricao: 'Limpeza de Pele Deep Glow & Spa Labial',
    imagem_url: '/images/services/facial_spa.png',
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
    imagem_url: '/images/services/makeup_glam.png',
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
    imagem_url: '/images/services/makeup_glam.png',
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
    imagem_url: '/images/services/brow_lamination.png',
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
    imagem_url: '/images/services/brow_lamination.png',
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
    imagem_url: '/images/services/facial_spa.png',
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
    imagem_url: '/images/services/facial_spa.png',
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
  whatsapp_numero: '',
  instagram_usuario: ''
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
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [configuracoes, setConfiguracoes] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [resCat, resServ, resConf] = await Promise.allSettled([
        supabase.from('catalogo_categorias').select('*').order('ordem', { ascending: true }),
        supabase.from('catalogo_servicos').select('*').order('ordem', { ascending: true }),
        supabase.from('catalogo_configuracoes').select('*').order('atualizado_em', { ascending: false }).limit(1).maybeSingle()
      ]);

      if (resCat.status === 'fulfilled' && resCat.value?.data && resCat.value.data.length > 0) {
        setCategorias(resCat.value.data.map(cat => ({
          ...cat,
          imagem_url: normalizarImagemUrl(cat.imagem_url, '/images/services/facial_spa.png')
        })));
      } else {
        setCategorias(CATEGORIAS_PADRAO);
      }

      if (resServ.status === 'fulfilled' && resServ.value?.data && resServ.value.data.length > 0) {
        setServicos(resServ.value.data.map(serv => ({
          ...serv,
          imagem_url: normalizarImagemUrl(serv.imagem_url, '/images/services/makeup_glam.png')
        })));
      } else {
        setServicos(SERVICOS_PADRAO);
      }

      if (resConf.status === 'fulfilled' && resConf.value?.data) {
        setConfiguracoes(resConf.value.data);
      } else {
        setConfiguracoes(CONFIG_PADRAO);
      }
    } catch (e) {
      console.warn('Usando catálogo local padrão:', e);
      setCategorias(CATEGORIAS_PADRAO);
      setServicos(SERVICOS_PADRAO);
      setConfiguracoes(CONFIG_PADRAO);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Contagem de serviços por categoria
  const categoriasComContagem = categorias.map(cat => ({
    ...cat,
    quantidade_servicos: servicos.filter(s => s.categoria_slug === cat.slug && s.ativo).length
  }));

  // =========================================================================
  // CRUD CATEGORIAS
  // =========================================================================
  async function criarCategoria(dados) {
    const slug = dados.slug || dados.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');
    const payload = {
      nome: dados.nome.trim(),
      slug,
      descricao: dados.descricao?.trim() || '',
      imagem_url: normalizarImagemUrl(dados.imagem_url, '/images/services/facial_spa.png'),
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
      imagem_url: normalizarImagemUrl(dados.imagem_url, '/images/services/makeup_glam.png'),
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
        imagem_url: normalizarImagemUrl(dados.imagem_url, '/images/services/makeup_glam.png'),
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

  return (
    <ContextoCatalogo.Provider
      value={{
        categorias: categoriasComContagem,
        servicos,
        configuracoes,
        carregando,
        recarregar: carregarDados,
        criarCategoria,
        atualizarCategoria,
        excluirCategoria,
        criarServico,
        atualizarServico,
        alternarStatusServico,
        excluirServico,
        salvarConfiguracoes
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
