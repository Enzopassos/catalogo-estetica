import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../database/clienteSupabase';
import { SISTEMA_ID, SISTEMA_SLUG } from '../config/supabaseConfig';

const ContextoAutenticacao = createContext(null);

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [politicas, setPoliticas] = useState([]);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [vinculoAtivo, setVinculoAtivo] = useState(false);

  /**
   * Carrega o vínculo e as políticas atribuídas ao usuário no sistema atual
   */
  const carregarPermissoesSistema = useCallback(async (user) => {
    if (!user || !SISTEMA_ID) {
      setPoliticas([]);
      setEhAdmin(false);
      setVinculoAtivo(false);
      return;
    }

    try {
      // 1. Garante que o usuário possua vínculo com este sistema
      if (SISTEMA_SLUG) {
        try {
          await supabase.rpc('garantir_vinculo_cliente', {
            p_sistema_slug: SISTEMA_SLUG
          });
        } catch (errRpc) {
          console.warn('Aviso ao garantir vínculo com o sistema:', errRpc);
        }
      }

      // 2. Checa se o usuário é Super Admin Global do ecossistema
      try {
        const { data: superAdmin } = await supabase.rpc('eh_super_admin');
        if (superAdmin === true) {
          setVinculoAtivo(true);
          setEhAdmin(true);
          setPoliticas(['super_admin', 'admin']);
          return;
        }
      } catch (errSuper) {
        // Se a RPC falhar ou não for super admin, prossegue para checar permissão local
      }

      // 3. Busca o vínculo específico deste usuário neste sistema
      const { data: vinculo, error } = await supabase
        .from('core_usuario_sistemas')
        .select(`
          id,
          ativo,
          core_usuario_politicas (
            core_politicas ( id, nome, permissoes )
          )
        `)
        .eq('sistema_id', SISTEMA_ID)
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar permissões do usuário:', error);
        setPoliticas([]);
        setEhAdmin(false);
        setVinculoAtivo(false);
        return;
      }

      if (!vinculo) {
        setPoliticas([]);
        setEhAdmin(false);
        setVinculoAtivo(false);
        return;
      }

      if (vinculo.ativo === false) {
        setVinculoAtivo(false);
        setPoliticas([]);
        setEhAdmin(false);
        return;
      }

      setVinculoAtivo(true);
      const listaPoliticas = (vinculo.core_usuario_politicas || [])
        .map(up => up.core_politicas?.nome?.toLowerCase())
        .filter(Boolean);

      setPoliticas(listaPoliticas);
      const isAdminLocal = listaPoliticas.some(p => ['admin', 'administrador'].includes(p));
      setEhAdmin(isAdminLocal);
    } catch (err) {
      console.error('Erro inesperado ao carregar permissões do sistema:', err);
      setPoliticas([]);
      setEhAdmin(false);
      setVinculoAtivo(false);
    }
  }, []);

  useEffect(() => {
    let montado = true;

    async function inicializarAutenticacao() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!montado) return;

        setSessao(session);
        setUsuario(session?.user || null);

        if (session?.user) {
          await carregarPermissoesSistema(session.user);
        }
      } catch (err) {
        console.error('Erro ao recuperar sessão:', err);
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    inicializarAutenticacao();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!montado) return;
      setSessao(session);
      setUsuario(session?.user || null);

      if (session?.user) {
        await carregarPermissoesSistema(session.user);
      } else {
        setPoliticas([]);
        setEhAdmin(false);
        setVinculoAtivo(false);
      }
      setCarregando(false);
    });

    return () => {
      montado = false;
      subscription?.unsubscribe();
    };
  }, [carregarPermissoesSistema]);

  async function fazerLogin(email, senha) {
    if (!email || !senha) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha
    });

    if (error) {
      if (/Invalid login credentials/i.test(error.message)) {
        throw new Error('E-mail ou senha incorretos.');
      }
      throw new Error(error.message || 'Falha ao autenticar.');
    }

    setSessao(data.session);
    setUsuario(data.user);
    if (data.user) {
      await carregarPermissoesSistema(data.user);
    }
    return data.user;
  }

  async function fazerLogout() {
    await supabase.auth.signOut();
    setSessao(null);
    setUsuario(null);
    setPoliticas([]);
    setEhAdmin(false);
    setVinculoAtivo(false);
  }

  return (
    <ContextoAutenticacao.Provider
      value={{
        usuario,
        sessao,
        estaAutenticado: !!usuario,
        carregando,
        politicas,
        ehAdmin,
        vinculoAtivo,
        fazerLogin,
        fazerLogout,
        recarregarPermissoes: () => carregarPermissoesSistema(usuario)
      }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  }
  return contexto;
}
