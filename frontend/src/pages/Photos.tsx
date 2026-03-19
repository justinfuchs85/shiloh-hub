import { useEffect, useState, useRef } from 'react'
import { api, uploadMedia } from '../api/client'
import type { Photo } from '../types'

const BACKEND = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const CATEGORIES = [
  'Exterior', 'Main Floor', 'Kitchen', 'Primary Bedroom', "Ethan's Room",
  "Elle's Room", "Riley's Room", 'Bathrooms', 'Basement', 'Pool & Outdoor', 'Garage', 'MLS', 'Other',
]

type LightboxState = { photos: string[]; index: number } | null

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [staged, setStaged] = useState<{ file: File; preview: string; caption: string; category: string }[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [addingUrl, setAddingUrl] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () =>
    api.getAll<Photo>('photos', { sort: 'category,order' })
      .then(setPhotos).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const getUrl = (photo: Photo): string => {
    if (photo.url) return photo.url
    if (photo.media && typeof photo.media === 'object' && 'url' in photo.media) {
      const url = (photo.media as { url: string }).url
      return url.startsWith('http') ? url : `${BACKEND}${url}`
    }
    return ''
  }

  const handleFiles = (files: FileList) => {
    const entries = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      category: 'Other',
    }))
    setStaged(prev => [...prev, ...entries])
  }

  const commitStaged = async () => {
    if (staged.length === 0) return
    setSaving(true)
    try {
      const created: Photo[] = []
      for (const s of staged) {
        const { id, url } = await uploadMedia(s.file)
        const photo = await api.create<Photo>('photos', {
          media: id,
          url,
          caption: s.caption || undefined,
          category: s.category,
          order: photos.length + created.length,
        })
        created.push(photo)
      }
      setPhotos(prev => [...prev, ...created])
      setStaged([])
      setShowUpload(false)
    } finally {
      setSaving(false)
    }
  }

  const addFromUrl = async () => {
    if (!urlInput.trim()) return
    setAddingUrl(true)
    try {
      const photo = await api.create<Photo>('photos', {
        url: urlInput.trim(),
        category: 'Other',
        order: photos.length,
      })
      setPhotos(prev => [...prev, photo])
      setUrlInput('')
    } finally {
      setAddingUrl(false)
    }
  }

  const removePhoto = async (id: string | number) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
    await api.delete('photos', id)
  }

  // Group by category
  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: photos.filter(p => p.category === cat),
  })).filter(g => g.items.length > 0)

  const openLightbox = (photoUrls: string[], index: number) => {
    setLightbox({ photos: photoUrls, index })
  }

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      {/* Upload panel */}
      <div className="card card-p" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Upload Photos</div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowUpload(v => !v)}>+ Add photos</button>
        </div>

        {showUpload && (
          <div style={{ marginTop: 12 }}>
            {/* Drop zone */}
            <div
              style={{ border: '1.5px dashed var(--border-2)', borderRadius: 'var(--r-lg)', padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.15s', marginBottom: 10 }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault() }}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files) }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>🖼</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Drop photos here or click to browse</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>JPG, PNG, HEIC, WebP — multiple files OK</div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => e.target.files && handleFiles(e.target.files)} />
            </div>

            {/* Staged */}
            {staged.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Set a caption and category for each photo:</div>
                {staged.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <img src={s.preview} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} alt="" />
                    <input className="input" style={{ flex: 1 }} placeholder="Caption (optional)" value={s.caption} onChange={e => setStaged(prev => prev.map((p, j) => j === i ? { ...p, caption: e.target.value } : p))} />
                    <select className="input" style={{ width: 130 }} value={s.category} onChange={e => setStaged(prev => prev.map((p, j) => j === i ? { ...p, category: e.target.value } : p))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => setStaged(prev => prev.filter((_, j) => j !== i))}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={commitStaged} disabled={saving}>{saving ? 'Uploading…' : `Save all (${staged.length})`}</button>
                  <button className="btn btn-ghost" onClick={() => setStaged([])}>Clear</button>
                </div>
              </div>
            )}

            {/* URL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-3)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>or paste a URL</span>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-3)' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input className="input" style={{ flex: 1 }} placeholder="Google Drive share link or any image URL…" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
              <button className="btn btn-ghost" onClick={addFromUrl} disabled={addingUrl}>Add URL</button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      {grouped.length === 0 && <div className="empty">No photos yet — upload some above.</div>}
      {grouped.map(({ cat, items }) => {
        const urls = items.map(getUrl)
        return (
          <div key={cat} style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{cat}</div>
            <div className="gallery-grid">
              {items.map((photo, idx) => (
                <div key={photo.id} style={{ position: 'relative', display: 'group' }}>
                  <img
                    src={getUrl(photo)}
                    alt={photo.caption ?? ''}
                    onClick={() => openLightbox(urls, idx)}
                  />
                  <button
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer', display: 'none' }}
                    className="delete-photo-btn"
                    onClick={e => { e.stopPropagation(); removePhoto(photo.id) }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox open" onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
            {lightbox.index > 0 && (
              <button onClick={() => setLightbox(p => p ? { ...p, index: p.index - 1 } : null)} style={{ position: 'absolute', left: -48, background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', padding: 8, lineHeight: 1 }}>‹</button>
            )}
            <img src={lightbox.photos[lightbox.index]} alt="" style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8 }} />
            {lightbox.index < lightbox.photos.length - 1 && (
              <button onClick={() => setLightbox(p => p ? { ...p, index: p.index + 1 } : null)} style={{ position: 'absolute', right: -48, background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', padding: 8, lineHeight: 1 }}>›</button>
            )}
          </div>
          <div style={{ color: '#ccc', fontSize: 13, marginTop: 12 }}>{lightbox.index + 1} / {lightbox.photos.length}</div>
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </>
  )
}
