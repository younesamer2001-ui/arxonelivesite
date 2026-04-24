import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jifxdjctyhkywwldrrmj.supabase.co'
// Fallback-nøkkel har riktig ref (jifxdjctyhkywwldrrmj). Gammel versjon i repo-historien
// hadde typo (ref: jifxdjctyhkewwldrrmj) som ga "Invalid API key" på alle requests.
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZnhkamN0eWhreXd3bGRycm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTgxNDAsImV4cCI6MjA4OTUzNDE0MH0.79C1UFZhhGGOhJ2kdc9QBeg_NsZuKcvF6tjRdeT1D8s'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
