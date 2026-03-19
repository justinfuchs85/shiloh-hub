import { useEffect, useState } from 'react'
import { api, uploadMedia } from '../api/client'
import type { Note, Space } from '../types'

const BACKEND = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', body: '', author: 'Justin' as 'Justin' | 'Natalie', space: '' })
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.getAll<Note>('notes', { sort: '-createdAt' }),
      api.getAll<Space>('spaces', { sort: 'order' }),
    ]).then(([n, s]) => { setNotes(n); setSpaces(s) }).finally(() => setLoading(false))
  }, [])

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImgFile(f)
    setImgPreview(URL.createObjectURL(f))
  }

  const post = async () => {
    if (!form.body.trim()) return
    setSaving(true)
    try {
      let imageId: number | undefined
      if (imgFile) {
        const uploaded = await uploadMedia(imgFile)
        imageId = uploaded.id
      }
      const payload: Partial<Note> & { space?: string | number; image?: number } = {
        title: form.title || undefined,
        body: form.body,
        author: form.author,
        space: form.space || undefined,
        image: imageId,
      }
      const created = await api.create<Note>('notes', payload)
      setNotes(prev => [created, ...prev])
      setForm({ title: '', body: '', author: 'Justin', space: '' })
      setImgFile(null)
      setImgPreview(null)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string | number) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    await api.delete('notes', id)
  }

  const getSpaceName = (space: Note['space']) => {
    if (!space) return null
    if (typeof space === 'object' && 'name' in space) return (space as Space).name
    const s = spaces.find(sp => sp.id === space)
    return s?.name ?? null
  }

  const getImageUrl = (image: Note['image']) => {
    if (!image) return null
    if (typeof image === 'object' && 'url' in image) return (image as { url: string }).url
    return null
  }

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      {/* Compose */}
      <div className="card card-p" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>New note</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="input" style={{ flex: 1 }} placeholder="Title (optional)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <select className="input" style={{ width: 120 }} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value as 'Justin' | 'Natalie' }))}>
            <option value="Justin">Justin</option>
            <option value="Natalie">Natalie</option>
          </select>
          <select className="input" style={{ width: 140 }} value={form.space} onChange={e => setForm(p => ({ ...p, space: e.target.value }))}>
            <option value="">No space</option>
            {spaces.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
          </select>
        </div>
        <textarea className="input" placeholder="Write a note…" rows={3} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} style={{ marginBottom: 8 }} />

        {imgPreview && (
          <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
            <img src={imgPreview} style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, display: 'block' }} alt="preview" />
            <button onClick={() => { setImgFile(null); setImgPreview(null) }} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 11, cursor: 'pointer' }}>✕</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
            📎 Attach image
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
          </label>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={post} disabled={saving || !form.body.trim()}>Post note</button>
        </div>
      </div>

      {/* Feed */}
      {notes.length === 0 ? (
        <div className="empty">No notes yet — add the first one above.</div>
      ) : (
        notes.map(note => {
          const spaceName = getSpaceName(note.space)
          const imgUrl = getImageUrl(note.image)
          return (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`note-author note-author-${note.author.toLowerCase()}`}>{note.author}</span>
                  {spaceName && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>in {spaceName}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="note-time">{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => remove(note.id)}>✕</button>
                </div>
              </div>
              {note.title && <div className="note-title">{note.title}</div>}
              <div className="note-body">{note.body}</div>
              {imgUrl && (
                <img src={imgUrl.startsWith('http') ? imgUrl : `${BACKEND}${imgUrl}`} style={{ marginTop: 10, maxWidth: '100%', borderRadius: 8 }} alt={note.title ?? ''} />
              )}
            </div>
          )
        })
      )}
    </>
  )
}
