import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jifxdjctyhkywwldrrmj.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZnhkamN0eWhrZXd3bGRycm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTk4MDUsImV4cCI6MjA1ODIzNTgwNX0.76GCcMN2R-w9uelLojR0MFO4pelBuhiVlSAMJOhBl7E'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
