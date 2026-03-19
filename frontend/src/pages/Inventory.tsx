import { useEffect, useState } from 'react'
import { api, uploadMedia } from '../api/client'
import type { InventoryItem, Space, MediaFile } from '../types'

const BACKEND = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const STATUSES = ['Undecided', 'Keep', 'Sell', 'Donate', 'Trash'] as const
const STATUS_CLASS: Record<string, string> = {
  Keep: 'inv-keep', Sell: 'inv-sell', Donate: 'inv-donate', Trash: 'inv-trash', Undecided: 'inv-undecided',
}

const blankForm = () => ({
  title: '', status: 'Undecided' as const, owner: 'Justin' as const,
  space: '', duplicate: false, notes: '',
})

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOwner, setFilterOwner] = useState('')
  const [filterSpace, setFilterSpace] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(blankForm())
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)

  const load = () =>
    Promise.all([
      api.getAll<InventoryItem>('inventory-items', { depth: 2 }),
      api.getAll<Space>('spaces', { sort: 'order' }),
    ]).then(([i, s]) => { setItems(i); setSpaces(s) }).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm(blankForm()); setEditId(null)
    setPhotoFile(null); setPhotoPreview(null)
    setShowModal(true)
  }

  const openEdit = (item: InventoryItem) => {
    const spaceId = !item.space ? '' : typeof item.space === 'object' ? String((item.space as Space).id) : String(item.space)
    setForm({ title: item.title, status: item.status as typeof form.status, owner: item.owner as typeof form.owner, space: spaceId, duplicate: item.duplicate, notes: item.notes ?? '' })
    setEditId(item.id)
    const photoUrl = getPhotoUrl(item.photo)
    setPhotoPreview(photoUrl)
    setPhotoFile(null)
    setShowModal(true)
  }

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      let photoId: number | undefined
      if (photoFile) {
        const uploaded = await uploadMedia(photoFile)
        photoId = uploaded.id
      }
      const payload: Partial<InventoryItem> & { photo?: number; space?: string | number | undefined } = {
        title: form.title,
        status: form.status,
        owner: form.owner,
        space: form.space || undefined,
        duplicate: form.duplicate,
        notes: form.notes || undefined,
        photo: photoId,
      }
      if (editId !== null) {
        const updated = await api.update<InventoryItem>('inventory-items', editId, payload)
        setItems(prev => prev.map(i => i.id === editId ? updated : i))
      } else {
        const created = await api.create<InventoryItem>('inventory-items', payload)
        setItems(prev => [created, ...prev])
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string | number) => {
    setItems(prev => prev.filter(i => i.id !== id))
    await api.delete('inventory-items', id)
    if (showModal) setShowModal(false)
  }

  const quickStatus = async (item: InventoryItem, status: typeof STATUSES[number]) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status } : i))
    await api.update('inventory-items', item.id, { status })
  }

  const getPhotoUrl = (photo: InventoryItem['photo']): string | null => {
    if (!photo) return null
    if (typeof photo === 'object') {
      const f = photo as MediaFile
      const url = f.sizes?.thumbnail?.url ?? f.url
      return url.startsWith('http') ? url : `${BACKEND}${url}`
    }
    return null
  }

  const getSpaceName = (space: InventoryItem['space']): string => {
    if (!space) return ''
    if (typeof space === 'object') return (space as Space).name
    return spaces.find(s => String(s.id) === String(space))?.name ?? ''
  }

  const filtered = items.filter(item => {
    if (filterStatus && item.status !== filterStatus) return false
    if (filterOwner && item.owner !== filterOwner) return false
    if (filterSpace) {
      const spId = typeof item.space === 'object' ? String((item.space as Space).id) : String(item.space ?? '')
      if (spId !== filterSpace) return false
    }
    return true
  })

  // Summary
  const summary = STATUSES.map(s => ({ status: s, count: items.filter(i => i.status === s).length })).filter(s => s.count > 0)

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      {/* Summary */}
      {summary.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
          {summary.map(({ status, count }) => (
            <span key={status} className={`inv-badge ${STATUS_CLASS[status]}`} style={{ padding: '4px 10px', fontSize: 11 }}>{count} {status}</span>
          ))}
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', alignSelf: 'center' }}>— {items.length} total</span>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 130 }} value={filterOwner} onChange={e => setFilterOwner(e.target.value)}>
          <option value="">Both owners</option>
          <option value="Justin">Justin</option>
          <option value="Natalie">Natalie</option>
          <option value="Both">Both / Shared</option>
        </select>
        <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 130 }} value={filterSpace} onChange={e => setFilterSpace(e.target.value)}>
          <option value="">All spaces</option>
          {spaces.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
        </select>
        <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 110 }} value={viewMode} onChange={e => setViewMode(e.target.value as 'grid' | 'list')}>
          <option value="grid">Grid view</option>
          <option value="list">List view</option>
        </select>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={openAdd}>+ Add Item</button>
      </div>

      {filtered.length === 0 && <div className="empty">No items yet — add the first one above.</div>}

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {filtered.map(item => {
            const photoUrl = getPhotoUrl(item.photo)
            return (
              <div key={item.id} className="inv-card" onClick={() => openEdit(item)}>
                <div style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'var(--warm-faint)', overflow: 'hidden' }}>
                  {photoUrl ? <img src={photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} /> : '📦'}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-dark)', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <span className={`inv-badge ${STATUS_CLASS[item.status]}`}>{item.status}</span>
                    {item.duplicate && <span className="inv-badge inv-dup">Dup</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(item => {
            const photoUrl = getPhotoUrl(item.photo)
            return (
              <div key={item.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-3)', borderRadius: 'var(--r-md)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => openEdit(item)}>
                <div style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, overflow: 'hidden' }}>
                  {photoUrl ? <img src={photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} /> : '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-dark)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.owner}{getSpaceName(item.space) ? ` — ${getSpaceName(item.space)}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {STATUSES.map(s => (
                    <button key={s} className={`inv-badge ${STATUS_CLASS[s]}`} style={{ padding: '4px 8px', cursor: 'pointer', border: item.status === s ? '1.5px solid currentColor' : '1.5px solid transparent', fontWeight: item.status === s ? 600 : 400 }} onClick={e => { e.stopPropagation(); quickStatus(item, s) }}>{s}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(10,20,18,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: 500, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-3)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 300, color: 'var(--warm-dark)' }}>{editId ? 'Edit Item' : 'Add Item'}</div>
              <button style={{ background: 'none', border: 'none', fontSize: 22, color: 'var(--warm-muted)', cursor: 'pointer' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Photo */}
              <div>
                <label className="field-label">Photo</label>
                {photoPreview && <img src={photoPreview} style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--r-md)', marginBottom: 8 }} alt="preview" />}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, border: '1.5px dashed var(--border-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, color: 'var(--teal)', background: 'var(--teal-subtle)' }}>
                  📷 Take Photo / Upload
                  <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)) } }} />
                </label>
              </div>
              {/* Title */}
              <div>
                <label className="field-label">Item name *</label>
                <input className="input" placeholder="e.g. IKEA MALM Dresser" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              {/* Owner + Space */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="field-label">Owner</label>
                  <select className="input" value={form.owner} onChange={e => setForm(p => ({ ...p, owner: e.target.value as typeof form.owner }))}>
                    <option value="Justin">Justin</option>
                    <option value="Natalie">Natalie</option>
                    <option value="Both">Both / Shared</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Space</label>
                  <select className="input" value={form.space} onChange={e => setForm(p => ({ ...p, space: e.target.value }))}>
                    <option value="">None</option>
                    {spaces.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="field-label">Decision</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <button key={s} className={`inv-badge ${STATUS_CLASS[s]}`} style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 12, border: form.status === s ? '1.5px solid currentColor' : '1.5px solid transparent', fontWeight: form.status === s ? 600 : 400 }} onClick={() => setForm(p => ({ ...p, status: s }))}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Duplicate */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.duplicate} onChange={e => setForm(p => ({ ...p, duplicate: e.target.checked })} style={{ width: 16, height: 16 }} />
                Mark as duplicate (we both have one of these)
              </label>
              {/* Notes */}
              <div>
                <label className="field-label">Notes</label>
                <input className="input" placeholder="Condition, estimated value, etc." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                {editId && <button className="btn btn-danger btn-sm" onClick={() => remove(editId)}>Delete</button>}
                <div style={{ flex: 1 }} />
                <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={save} disabled={saving || !form.title.trim()}>Save Item</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
