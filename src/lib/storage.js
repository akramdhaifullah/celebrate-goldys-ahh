/**
 * Storage abstraction — uses Supabase when env vars are set, otherwise localStorage.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const BUCKET       = import.meta.env.VITE_SUPABASE_BUCKET || 'memories'

const LS_KEY_MEMORIES = 'goldan_memories'
const LS_KEY_WISHES   = 'goldan_wishes'

// ── Lazy Supabase client ──────────────────────────────────────────────────────
let _sb = null
function sb() {
  if (_sb) return _sb
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  // Dynamic import so tree-shaking still works when not configured
  return null // replaced below after async init
}

// Export a flag so components can know whether Supabase is configured
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY)

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Add a memory (photo + note + name + message).
 * @param {{ file: File, note: string, name: string, message: string }} data
 * @returns {Promise<void>}
 */
export async function addMemory({ file, note, name, message }) {
  if (hasSupabase) {
    const { createClient } = await import('@supabase/supabase-js')
    _sb = _sb || createClient(SUPABASE_URL, SUPABASE_KEY)

    // Upload photo
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await _sb.storage.from(BUCKET).upload(path, file)
    if (upErr) throw upErr

    const { data: { publicUrl } } = _sb.storage.from(BUCKET).getPublicUrl(path)

    // Insert row
    const { error: insErr } = await _sb
      .from('memories')
      .insert({ name, message, note, img_url: publicUrl })
    if (insErr) throw insErr
  } else {
    // localStorage fallback — convert file to data URL
    const imgSrc = await fileToDataUrl(file)
    const memories = getLocalMemories()
    memories.push({ imgSrc, note, name, message, id: Date.now() })
    localStorage.setItem(LS_KEY_MEMORIES, JSON.stringify(memories))

    const wishes = getLocalWishes()
    wishes.push({ msg: `\u201c${message}\u201d`, sig: `\u2014 ${name}` })
    localStorage.setItem(LS_KEY_WISHES, JSON.stringify(wishes))
  }
}

/**
 * Fetch all memories.
 * @returns {Promise<Array<{ id, imgSrc|img_url, note, name, message }>>}
 */
export async function getMemories() {
  if (hasSupabase) {
    const { createClient } = await import('@supabase/supabase-js')
    _sb = _sb || createClient(SUPABASE_URL, SUPABASE_KEY)
    const { data, error } = await _sb
      .from('memories')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data || []).map(r => ({ ...r, imgSrc: r.img_url }))
  }
  return getLocalMemories()
}

/**
 * Fetch all wishes (from localStorage only — derived from memories on Supabase).
 */
export function getWishes() {
  if (hasSupabase) return [] // wishes are derived from memories on Supabase path
  return getLocalWishes()
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLocalMemories() {
  try { return JSON.parse(localStorage.getItem(LS_KEY_MEMORIES) || '[]') }
  catch { return [] }
}

function getLocalWishes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY_WISHES) || '[]') }
  catch { return [] }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
