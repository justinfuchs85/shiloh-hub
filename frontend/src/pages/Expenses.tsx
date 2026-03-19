import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Expense } from '../types'

const parseDollar = (s?: string) => {
  if (!s) return 0
  return parseFloat(s.replace(/[$,]/g, '')) || 0
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ description: '', est: '', actual: '' })
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)

  useEffect(() => {
    api.getAll<Expense>('expenses', { sort: 'order' })
      .then(setExpenses).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!form.description.trim()) return
    setSaving(true)
    try {
      if (editId !== null) {
        const updated = await api.update<Expense>('expenses', editId, form)
        setExpenses(prev => prev.map(e => e.id === editId ? updated : e))
        setEditId(null)
      } else {
        const created = await api.create<Expense>('expenses', { ...form, order: expenses.length })
        setExpenses(prev => [...prev, created])
      }
      setForm({ description: '', est: '', actual: '' })
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (exp: Expense) => {
    setForm({ description: exp.description, est: exp.est ?? '', actual: exp.actual ?? '' })
    setEditId(exp.id)
    setShowForm(true)
  }

  const remove = async (id: string | number) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    await api.delete('expenses', id)
  }

  const estTotal = expenses.reduce((s, e) => s + parseDollar(e.est), 0)
  const actualTotal = expenses.reduce((s, e) => s + parseDollar(e.actual), 0)
  const fmt = (n: number) => n ? `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="section-title" style={{ margin: 0 }}>Purchase expenses</div>
        <button className="btn btn-secondary btn-sm" onClick={() => { setShowForm(v => !v); setEditId(null); setForm({ description: '', est: '', actual: '' }) }}>
          + Add expense
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', borderBottom: '0.5px solid var(--border-3)', background: 'var(--bg-secondary)' }}>
          <span>Description</span>
          <span style={{ textAlign: 'right', paddingRight: 16 }}>Est.</span>
          <span style={{ textAlign: 'right', paddingRight: 16 }}>Actual</span>
          <span />
        </div>

        {expenses.length === 0 ? (
          <div className="empty">No expenses yet.</div>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', padding: '10px 14px', borderBottom: '0.5px solid var(--border-3)', fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-primary)' }}>{exp.description}</span>
              <span style={{ textAlign: 'right', paddingRight: 16, color: 'var(--text-secondary)' }}>{exp.est || '—'}</span>
              <span style={{ textAlign: 'right', paddingRight: 16, color: 'var(--text-info)', fontWeight: 500 }}>{exp.actual || '—'}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => startEdit(exp)}>✏</button>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => remove(exp.id)}>✕</button>
              </div>
            </div>
          ))
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', padding: '10px 14px', borderTop: '0.5px solid var(--border-3)', background: 'var(--bg-secondary)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', paddingRight: 16 }}>{fmt(estTotal)}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-info)', textAlign: 'right', paddingRight: 16 }}>{fmt(actualTotal)}</span>
          <span />
        </div>
      </div>

      {showForm && (
        <div className="card card-p" style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {editId !== null ? 'Edit expense' : 'New expense'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input className="input" placeholder="Description (e.g. Home inspection)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Estimated ($)" value={form.est} onChange={e => setForm(p => ({ ...p, est: e.target.value }))} />
              <input className="input" placeholder="Actual ($)" value={form.actual} onChange={e => setForm(p => ({ ...p, actual: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{editId !== null ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
