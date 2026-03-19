import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Utility } from '../types'

const STATUS_CLASS: Record<string, string> = {
  'Active': 'util-active',
  'Transfer in progress': 'util-transfer',
  'Not set up': 'util-not-set',
  'Cancelled': 'util-cancelled',
}

const blankForm = () => ({
  type: '', provider: '', phone: '', website: '', account: '', username: '',
  cost: '', status: 'Not set up', notes: '',
})

export default function Utilities() {
  const [utils, setUtils] = useState<Utility[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankForm())
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [expandedId, setExpandedId] = useState<string | number | null>(null)

  useEffect(() => {
    api.getAll<Utility>('utilities', { sort: 'order' })
      .then(setUtils).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!form.type.trim()) return
    setSaving(true)
    try {
      if (editId !== null) {
        const updated = await api.update<Utility>('utilities', editId, form)
        setUtils(prev => prev.map(u => u.id === editId ? updated : u))
        setEditId(null)
      } else {
        const created = await api.create<Utility>('utilities', { ...form, order: utils.length })
        setUtils(prev => [...prev, created])
      }
      setForm(blankForm()); setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string | number) => {
    setUtils(prev => prev.filter(u => u.id !== id))
    await api.delete('utilities', id)
  }

  const active = utils.filter(u => u.status === 'Active').length
  const totalMo = utils.reduce((s, u) => s + (parseFloat(u.cost?.replace(/[$,]/g, '') ?? '') || 0), 0)

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {active} active{totalMo > 0 ? ` · ~$${Math.round(totalMo)}/mo` : ''}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(v => !v); setEditId(null); setForm(blankForm()) }}>+ Add Utility</button>
      </div>

      {showForm && (
        <div className="card card-p" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {editId !== null ? 'Edit utility' : 'New utility'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input className="input" placeholder="Service type (e.g. Electric) *" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
            <input className="input" placeholder="Provider name" value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))} />
            <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            <input className="input" placeholder="Website" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            <input className="input" placeholder="Account number" value={form.account} onChange={e => setForm(p => ({ ...p, account: e.target.value }))} />
            <input className="input" placeholder="Online username" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            <input className="input" placeholder="Est. monthly cost ($)" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} />
            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {['Not set up', 'Transfer in progress', 'Active', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{editId !== null ? 'Save' : 'Add'}</button>
          </div>
        </div>
      )}

      {utils.length === 0 && !showForm && <div className="empty">No utilities yet — add some above.</div>}

      {utils.map(util => (
        <div key={util.id} className="util-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--warm-dark)' }}>{util.type}</span>
                <span className={`util-status ${STATUS_CLASS[util.status] ?? 'util-not-set'}`}>{util.status}</span>
              </div>
              {util.provider && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 3 }}>{util.provider}</div>}
              {util.cost && <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 500 }}>~${util.cost}/mo</div>}
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setExpandedId(expandedId === util.id ? null : util.id)}>
                {expandedId === util.id ? '▴' : '▾'}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => { setEditId(util.id); setForm({ type: util.type, provider: util.provider ?? '', phone: util.phone ?? '', website: util.website ?? '', account: util.account ?? '', username: util.username ?? '', cost: util.cost ?? '', status: util.status, notes: util.notes ?? '' }); setShowForm(true) }}>✏</button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => remove(util.id)}>✕</button>
            </div>
          </div>

          {expandedId === util.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-3)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                ['Phone', util.phone],
                ['Website', util.website],
                ['Account #', util.account],
                ['Username', util.username],
                ['Notes', util.notes],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {label === 'Website' ? <a href={value as string} target="_blank" rel="noreferrer" style={{ color: 'var(--text-info)' }}>{value}</a> : value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
