export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SISTEMA_ID = import.meta.env.VITE_SISTEMA_ID || '';
export const SISTEMA_SLUG = import.meta.env.VITE_SISTEMA_SLUG || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ [Configuração Supabase] Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique seu arquivo .env.'
  );
}

if (!SISTEMA_ID || !SISTEMA_SLUG) {
  console.warn(
    '⚠️ [Configuração Core] Variáveis de ambiente VITE_SISTEMA_ID e VITE_SISTEMA_SLUG não foram encontradas. Verifique seu arquivo .env.'
  );
}
