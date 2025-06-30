// Environment configuration
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  baseUrl: import.meta.env.DEV 
    ? 'http://localhost:5173' 
    : 'https://scoresweep.org',
  supabase: {
    url: import.meta.env.SUPABASE_URL,
    anonKey: import.meta.env.SUPABASE_ANON_KEY,
  }
};