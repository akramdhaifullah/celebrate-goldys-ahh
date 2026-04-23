/**
 * Storage — Supabase only. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const BUCKET       = import.meta.env.VITE_SUPABASE_BUCKET || 'memories'

let _sb = null
async function client() {
  if (_sb) return _sb
  const { createClient } = await import('@supabase/supabase-js')
  _sb = createClient(SUPABASE_URL, SUPABASE_KEY)
  return _sb
}

/**
 * Add a memory (photo + note + name + message).
 */
export async function addMemory({ file, note, name, message }) {
  const sb = await client()

  const ext  = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file)
  if (upErr) throw upErr

  const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path)

  const { error: insErr } = await sb
    .from('memories')
    .insert({ name, message, note, img_url: publicUrl })
  if (insErr) throw insErr
}

/**
 * Fetch all memories ordered by submission time.
 */
export async function getMemories() {
  const sb = await client()
  const { data, error } = await sb
    .from('memories')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(r => ({ ...r, imgSrc: r.img_url }))
}
