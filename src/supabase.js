import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kafwxmgxjkkycppmqsil.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnd4bWd4amtreWNwcG1xc2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTczMDEsImV4cCI6MjA3MTUzMzMwMX0.eqd7YKGnei4_8LH4SelZ-60ac8q8yC0tka7zVU-Gzb0"
export const supabase = createClient(supabaseUrl, supabaseKey)