import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Project, Subtask } from '../types'

const PRIORITY_CLASS: Record<string, string> = {
  'before-move': 'proj-before', 'soon': 'proj-soon', 'someday': 'proj-someday',
}
const PRIORITY_LABEL: Record<string, string> = {
  'before-move': 'Before move-in', 'soon': 'Soon', 'someday': 'Someday',
}
const STATUS_CLASS: Record<string, string> = {
  'planning': 'proj-planning', 'progress': 'proj-progress', 'complete': 'proj-complete',
}
const STATUS_LABEL: Record<string, string> = {
  'planning': 'Planning', 'progress': 'In progress', 'complete': 'Complete',
}
const CATEGORIES = [
  'Pool & Outdoor', 'Landscaping', 'Bedrooms', 'Primary Bedroom', 'Kitchen',
  'Bathrooms', 'Basement', 'Living Areas', 'Exterior', 'Other',
]

const blankForm = () => ({
  name: '', category: 'Other', priority: 'soon', status: 'planning',
  costEst: '', contractor: '', notes: '',
})

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankForm())
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)
  const [expanded, setExpanded] = useState<Set<string | number>>(new Set())

  const load = () =>
    api.getAll<Project>('projects', { sort: 'order' })
      .then(setProjects).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editId !== null) {
        const updated = await api.update<Project>('projects', editId, form)
        setProjects(prev => prev.map(p => p.id === editId ? updated : p))
        setEditId(null)
      } else {
        const created = await api.create<Project>('projects', { ...form, done: false, order: projects.length, subtasks: [] })
        setProjects(prev => [...prev, created])
      }
      setForm(blankForm()); setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const toggleProject = async (proj: Project) => {
    const done = !proj.done
    const status = done ? 'complete' : 'planning'
    setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, done, status } : p))
    await api.update('projects', proj.id, { done, status })
  }

  const toggleSubtask = async (proj: Project, idx: number) => {
    const subtasks = (proj.subtasks ?? []).map((st, i) => i === idx ? { ...st, done: !st.done } : st)
    setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, subtasks } : p))
    await api.update('projects', proj.id, { subtasks })
  }

  const addSubtask = async (proj: Project, label: string) => {
    if (!label.trim()) return
    const subtasks = [...(proj.subtasks ?? []), { label, done: false }]
    setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, subtasks } : p))
    await api.update('projects', proj.id, { subtasks })
  }

  const remove = async (id: string | number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    await api.delete('projects', id)
  }

  const toggleExpand = (id: string | number) => {
    setExpanded(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  // Group by category
  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: projects.filter(p => p.category === cat),
  })).filter(g => g.items.length > 0)

  const total = projects.length
  const done = projects.filter(p => p.done).length

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{done}/{total} complete</div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(v => !v); setEditId(null); setForm(blankForm()) }}>+ Add Project</button>
      </div>

      {showForm && (
        <div className="card card-p" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {editId !== null ? 'Edit project' : 'New project'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Project name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              <option value="before-move">Before move-in</option>
              <option value="soon">Soon</option>
              <option value="someday">Someday</option>
            </select>
            <input className="input" placeholder="Est. cost ($)" value={form.costEst} onChange={e => setForm(p => ({ ...p, costEst: e.target.value }))} />
            <input className="input" placeholder="Contractor / vendor" value={form.contractor} onChange={e => setForm(p => ({ ...p, contractor: e.target.value }))} />
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{editId !== null ? 'Save' : 'Add project'}</button>
          </div>
        </div>
      )}

      {projects.length === 0 && !showForm && <div className="empty">No projects yet.</div>}

      {grouped.map(({ cat, items }) => (
        <div key={cat} style={{ marginBottom: '1.5rem' }}>
          <div className="section-title">{cat}</div>
          {items.map(proj => {
            const isExpanded = expanded.has(proj.id)
            const subtasks = proj.subtasks ?? []
            return (
              <div key={proj.id} className={`proj-card${proj.done ? ' done' : ''}`}>
                <div className="proj-header" onClick={() => toggleExpand(proj.id)}>
                  <div className="proj-check" onClick={e => { e.stopPropagation(); toggleProject(proj) }}>
                    {proj.done && <div className="checkmark" style={{ width: 6, height: 9, border: '2px solid #fff', borderLeft: 'none', borderTop: 'none', transform: 'rotate(45deg) translate(-1px,-1px)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="proj-name">{proj.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 5 }}>
                      <span className={`proj-tag ${PRIORITY_CLASS[proj.priority]}`}>{PRIORITY_LABEL[proj.priority]}</span>
                      <span className={`proj-tag ${STATUS_CLASS[proj.status]}`}>{STATUS_LABEL[proj.status]}</span>
                      {proj.costEst && <span className="proj-tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>{proj.costEst}</span>}
                      {proj.contractor && <span className="proj-tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>{proj.contractor}</span>}
                    </div>
                    {proj.notes && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{proj.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={e => { e.stopPropagation(); setEditId(proj.id); setForm({ name: proj.name, category: proj.category, priority: proj.priority, status: proj.status, costEst: proj.costEst ?? '', contractor: proj.contractor ?? '', notes: proj.notes ?? '' }); setShowForm(true) }}>✏</button>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={e => { e.stopPropagation(); remove(proj.id) }}>✕</button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="proj-subtasks">
                    {subtasks.map((st, idx) => (
                      <div key={idx} className={`proj-subtask${st.done ? ' st-done' : ''}`} onClick={() => toggleSubtask(proj, idx)}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: st.done ? 'var(--teal)' : 'transparent', borderColor: st.done ? 'var(--teal)' : undefined }}>
                          {st.done && <div style={{ width: 4, height: 6, border: '1.5px solid #fff', borderLeft: 'none', borderTop: 'none', transform: 'rotate(45deg) translate(-1px,-1px)' }} />}
                        </div>
                        <span style={{ fontSize: 13 }}>{st.label}</span>
                      </div>
                    ))}
                    <SubtaskAdder onAdd={label => addSubtask(proj, label)} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

function SubtaskAdder({ onAdd }: { onAdd: (label: string) => void }) {
  const [label, setLabel] = useState('')
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
      <input className="input" style={{ flex: 1, fontSize: 12, padding: '5px 8px' }} placeholder="Add subtask…" value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && label.trim()) { onAdd(label); setLabel('') } }} />
      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => { if (label.trim()) { onAdd(label); setLabel('') } }}>+ Add</button>
    </div>
  )
}
