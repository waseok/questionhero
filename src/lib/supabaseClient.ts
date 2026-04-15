import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anon);

let client: SupabaseClient | null = null;

/** 환경 변수가 없으면 null (오프라인 연습만 가능). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) client = createClient(url!, anon!, { auth: { persistSession: false } });
  return client;
}
