import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Space } from '../types'

export default function Spaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getAll<Space>('spaces', { sort: 'order' })
      .then(setSpaces).finally(() => setLoading(false))
  }, [])

  const add = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const created = await api.create<Space>('spaces', { name: newName, order: spaces.length })
    setSpaces(prev => [...prev, created])
    setNewName('')
    setSaving(false)
  }

  const remove = async (id: string | number) => {
    setSpaces(prev => prev.filter(s => s.id !== id))
    await api.delete('spaces', id)
  }

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Spaces represent rooms and areas in the home. They are shared across Photos, Shopping, Notes, and Inventory.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {spaces.map(space => (
          <div key={space.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-3)', borderRadius: 'var(--r-lg)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-dark)' }}>🏠 {space.name}</span>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px', opacity: 0.5 }} onClick={() => remove(space.id)}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="Add a new space…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="btn btn-primary" onClick={add} disabled={saving || !newName.trim()}>+ Add Space</button>
      </div>
    </>
  )
}
