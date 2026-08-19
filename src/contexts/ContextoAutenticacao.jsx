import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../database/clienteSupabase';

const ContextoAutenticacao = createContext(null);

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Obtém sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setUsuario(session?.user || null);
      setCarregando(false);
    });

    // Escuta alterações na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      setUsuario(session?.user || null);
      setCarregando(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
    return data.user;
  }

  async function fazerLogout() {
    await supabase.auth.signOut();
    setSessao(null);
    setUsuario(null);
  }

  return (
    <ContextoAutenticacao.Provider
      value={{
        usuario,
        sessao,
        estaAutenticado: !!usuario,
        carregando,
        fazerLogin,
        fazerLogout
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
