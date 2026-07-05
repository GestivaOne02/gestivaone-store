const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://uhbmoslwucdhwrkgdleo.supabase.co'
const supabaseAnonKey = 'sb_publishable_KiUko3HqeUGDFYCoTDEpOw_5ERJ50Ll'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const store_slug = 'rutaedu'
  console.log(`Buscando tienda con slug: "${store_slug}"`)
  
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('store_slug', store_slug)
    .single()

  if (error) {
    console.error('❌ Error de consulta:', error)
  } else {
    console.log('✅ Compañía encontrada:', {
      id: company.id,
      name: company.name,
      store_slug: company.store_slug,
      store_enabled: company.store_enabled,
      store_settings: company.store_settings
    })
  }
}

run()
