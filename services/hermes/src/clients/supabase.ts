import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.js';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'Content-Type': 'application/json' },
  },
};

export const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY, options);
