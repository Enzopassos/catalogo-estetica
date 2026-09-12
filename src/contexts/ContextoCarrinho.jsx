import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useCatalogo } from './ContextoCatalogo';

const ContextoCarrinho = createContext(null);
const CHAVE_STORAGE_CARRINHO = 'gabriela_carrinho_agendamento_v1';

function serializarCarrinhoParaStorage(mapaItens) {
  try {
    const lista = [];
    mapaItens.forEach((item, id) => {
      lista.push({
        id,
        servico: item.servico,
        adicionais: Array.from(item.adicionais || [])
      });
    });
    return JSON.stringify(lista);
  } catch (err) {
    console.error('Erro ao serializar carrinho para storage:', err);
    return null;
  }
}

function carregarCarrinhoDoStorage() {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE_CARRINHO);
    if (!salvo) return new Map();
    const lista = JSON.parse(salvo);
    if (!Array.isArray(lista)) return new Map();

    const mapa = new Map();
    lista.forEach(item => {
      if (item && item.id && item.servico) {
        mapa.set(item.id, {
          servico: item.servico,
          adicionais: new Set(Array.isArray(item.adicionais) ? item.adicionais : [])
        });
      }
    });
    return mapa;
  } catch (err) {
    console.warn('Erro ao restaurar carrinho do storage:', err);
    return new Map();
  }
}

export function ProvedorCarrinho({ children }) {
  const { configuracoes } = useCatalogo();
  
  // Estrutura: Map de serviceId -> { servico, adicionaisSelecionados: Set<addonId> }
  // Inicializa automaticamente com dados persistidos no localStorage (se existirem)
  const [itensSelecionados, setItensSelecionados] = useState(() => carregarCarrinhoDoStorage());
  const [modalAberto, setModalAberto] = useState(false);

  // Sincroniza o carrinho com o localStorage a cada alteração
  useEffect(() => {
    try {
      if (itensSelecionados.size === 0) {
        localStorage.removeItem(CHAVE_STORAGE_CARRINHO);
      } else {
        const serializado = serializarCarrinhoParaStorage(itensSelecionados);
        if (serializado) {
          localStorage.setItem(CHAVE_STORAGE_CARRINHO, serializado);
        }
      }
    } catch (err) {
      console.warn('Não foi possível persistir o carrinho no localStorage:', err);
    }
  }, [itensSelecionados]);

  function alternarServico(servico) {
    setItensSelecionados(prev => {
      const novo = new Map(prev);
      if (novo.has(servico.id)) {
        novo.delete(servico.id);
      } else {
        novo.set(servico.id, {
          servico,
          adicionais: new Set()
        });
      }
      return novo;
    });
  }

  function removerServico(servicoId) {
    setItensSelecionados(prev => {
      const novo = new Map(prev);
      novo.delete(servicoId);
      if (novo.size === 0) {
        setModalAberto(false);
      }
      return novo;
    });
  }

  function alternarAdicional(servico, addonId) {
    setItensSelecionados(prev => {
      const novo = new Map(prev);
      let item = novo.get(servico.id);
      if (!item) {
        item = { servico, adicionais: new Set() };
        novo.set(servico.id, item);
      }

      const novosAdicionais = new Set(item.adicionais);
      if (novosAdicionais.has(addonId)) {
        novosAdicionais.delete(addonId);
      } else {
        novosAdicionais.add(addonId);
      }

      novo.set(servico.id, { ...item, adicionais: novosAdicionais });
      return novo;
    });
  }

  function possuiServico(servicoId) {
    return itensSelecionados.has(servicoId);
  }

  function possuiAdicional(servicoId, addonId) {
    const item = itensSelecionados.get(servicoId);
    return item ? item.adicionais.has(addonId) : false;
  }

  function limparCarrinho() {
    setItensSelecionados(new Map());
    setModalAberto(false);
    try {
      localStorage.removeItem(CHAVE_STORAGE_CARRINHO);
    } catch {}
  }

  // Cálculos de totais
  const { resumoItens, valorTotal, quantidadeTotal } = useMemo(() => {
    let total = 0;
    const resumo = [];

    itensSelecionados.forEach(({ servico, adicionais }) => {
      let subtotal = Number(servico.preco || 0);
      const adicionaisDetalhados = [];

      const listaAddons = servico.adicionais || [];
      listaAddons.forEach(addon => {
        if (adicionais.has(addon.id)) {
          subtotal += Number(addon.preco || 0);
          adicionaisDetalhados.push(addon);
        }
      });

      total += subtotal;
      resumo.push({
        servico,
        adicionais: adicionaisDetalhados,
        subtotal
      });
    });

    return {
      resumoItens: resumo,
      valorTotal: total,
      quantidadeTotal: itensSelecionados.size
    };
  }, [itensSelecionados]);

  const valorTotalFormatado = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorTotal);
  }, [valorTotal]);

  // Geração de mensagem formatada para o WhatsApp
  function enviarParaWhatsApp({ nomeCliente, dataPreferencial, periodoPreferencial, observacoes }) {
    if (resumoItens.length === 0) return;

    const nomeProfissional = configuracoes?.nome_negocio || 'Gabriela';
    let mensagem = `*Olá, ${nomeProfissional}! Gostaria de agendar os seguintes procedimentos:*\n\n`;

    resumoItens.forEach(({ servico, adicionais, subtotal }, index) => {
      mensagem += `*${index + 1}. ${servico.titulo}*\n`;
      mensagem += `⏱ Duração: ${servico.duracao_minutos} min\n`;
      mensagem += `💰 Valor base: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)}\n`;

      if (adicionais.length > 0) {
        mensagem += `✨ *Adicionais Selecionados:*\n`;
        adicionais.forEach(add => {
          mensagem += `   • ${add.nome} (+ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(add.preco)})\n`;
        });
      }

      mensagem += `👉 *Subtotal do item:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}\n\n`;
    });

    mensagem += `━━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `💳 *VALOR TOTAL ESTIMADO:* ${valorTotalFormatado}\n\n`;

    mensagem += `👤 *Cliente:* ${nomeCliente.trim()}\n`;
    if (dataPreferencial) {
      const [ano, mes, dia] = dataPreferencial.split('-');
      mensagem += `📅 *Data Preferencial:* ${dia}/${mes}/${ano}\n`;
    }
    const periodos = { manha: 'Manhã', tarde: 'Tarde', indiferente: 'Qualquer Período' };
    mensagem += `⏰ *Período:* ${periodos[periodoPreferencial] || 'Qualquer'}\n`;

    if (observacoes && observacoes.trim() !== '') {
      mensagem += `📝 *Observações:* ${observacoes.trim()}\n`;
    }

    const whatsDestino = (configuracoes?.whatsapp_numero || '').replace(/\D/g, '');
    const urlWhatsApp = whatsDestino
      ? `https://wa.me/${whatsDestino}?text=${encodeURIComponent(mensagem)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
    limparCarrinho();
    setModalAberto(false);
  }

  return (
    <ContextoCarrinho.Provider
      value={{
        itensSelecionados,
        resumoItens,
        valorTotal,
        valorTotalFormatado,
        quantidadeTotal,
        modalAberto,
        abrirModal: () => setModalAberto(true),
        fecharModal: () => setModalAberto(false),
        alternarServico,
        removerServico,
        alternarAdicional,
        possuiServico,
        possuiAdicional,
        limparCarrinho,
        enviarParaWhatsApp
      }}
    >
      {children}
    </ContextoCarrinho.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(ContextoCarrinho);
  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de um ProvedorCarrinho');
  }
  return contexto;
}
