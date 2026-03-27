import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // We will define this if needed, or just remove for now. Actually, let's just use any for now or let the user know. Let's just create a simpler client.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
