import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hasmwxxreklsnmfsanlc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc213eHhyZWtsc25tZnNhbmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Njg0MzAsImV4cCI6MjA2MDQ0NDQzMH0.i9J9y6o9m3IZzKMCPScGvAWoFzyWNrG6XWCOHqKR-F0'

export const supabase = createClient(supabaseUrl, supabaseKey)
