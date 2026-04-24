/**
 * Server-side Supabase client with elevated privileges.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY when present (required for writing to
 * tables protected by Row Level Security, e.g. `calls`). Falls back to
 * the public anon key so the app still boots in environments where the
 * service-role secret hasn't been configured yet — reads will keep
 * working, writes will no-op with an RLS error (surfaced by the caller).
 *
 * NEVER import this module from a client component. The service-role
 * key must stay on the server. Only use it from API route handlers and
 * server actions.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jifxdjctyhkywwldrrmj.supabase.co';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
// NB: hardkodet fallback har riktig ref (jifxdjctyhkywwldrrmj). Den gamle nøkkelen
// i repo-historien hadde typo (ref: jifxdjctyhkewwldrrmj) som forårsaket "Invalid API key"
// når Vercel-env mangler SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_ANON_KEY.
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZnhkamN0eWhreXd3bGRycm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTgxNDAsImV4cCI6MjA4OTUzNDE0MH0.79C1UFZhhGGOhJ2kdc9QBeg_NsZuKcvF6tjRdeT1D8s';

const KEY = SERVICE_ROLE_KEY || ANON_KEY;

export const supabaseAdmin = createClient(SUPABASE_URL, KEY, {
  auth: {
    // Service role tokens should not persist sessions or auto-refresh.
    autoRefreshToken: false,
    persistSession: false,
  },
});

/** True when we are using the service-role key (i.e. writes will succeed). */
export const hasServiceRole = Boolean(SERVICE_ROLE_KEY);
