import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Task, Milestone } from '../types'
import { PHASES } from '../types'

type NewTask = { title: string; detail: string; due: string; assignee: '' | 'Justin' | 'Natalie'; phase: string }
type NewMilestone = { label: string; date: string; type: 'key' | 'deadline' | 'done' }

const defaultTask: NewTask = { title: '', detail: '', due: '', assignee: '', phase: '0' }
const defaultMs: NewMilestone = { label: '', date: '', type: 'key' }

export default function Timeline() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddMs, setShowAddMs] = useState(false)
  const [newTask, setNewTask] = useState<NewTask>(defaultTask)
  const [newMs, setNewMs] = useState<NewMilestone>(defaultMs)
  const [saving, setSaving] = useState(false)

  const load = () =>
    Promise.all([
      api.getAll<Task>('tasks', { sort: 'order' }),
      api.getAll<Milestone>('milestones', { sort: 'date' }),
    ]).then(([t, m]) => { setTasks(t); setMilestones(m) }).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const toggleTask = async (task: Task) => {
    const updated = { ...task, done: !task.done }
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t))
    await api.update('tasks', task.id, { done: !task.done })
  }

  const addTask = async () => {
    if (!newTask.title.trim()) return
    setSaving(true)
    const created = await api.create<Task>('tasks', { ...newTask, done: false, order: tasks.length })
    setTasks(prev => [...prev, created])
    setNewTask(defaultTask)
    setShowAddTask(false)
    setSaving(false)
  }

  const addMilestone = async () => {
    if (!newMs.label.trim() || !newMs.date) return
    setSaving(true)
    const created = await api.create<Milestone>('milestones', { ...newMs, order: milestones.length })
    setMilestones(prev => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)))
    setNewMs(defaultMs)
    setShowAddMs(false)
    setSaving(false)
  }

  const deleteTask = async (id: string | number) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await api.delete('tasks', id)
  }

  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  // Group tasks by phase
  const byPhase = PHASES.map((label, idx) => ({
    label,
    items: tasks.filter(t => t.phase === String(idx)),
  }))

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      {/* Milestones */}
      <div className="card card-p" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key milestones</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddMs(v => !v)}>+ Milestone</button>
        </div>

        {milestones.length === 0 && !showAddMs && (
          <div className="empty" style={{ padding: '0.5rem 0' }}>No milestones yet.</div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {milestones.map(ms => {
            const color = ms.type === 'deadline' ? '#854f0b' : ms.type === 'done' ? '#2d6b3f' : 'var(--teal-dark)'
            const bg = ms.type === 'deadline' ? '#faeeda' : ms.type === 'done' ? '#e8f2ec' : 'var(--teal-muted)'
            return (
              <div key={ms.id} style={{ background: bg, borderRadius: 'var(--r-md)', padding: '7px 12px', fontSize: 12, color }}>
                <div style={{ fontWeight: 500 }}>{ms.label}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{new Date(ms.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            )
          })}
        </div>

        {showAddMs && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-3)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="field-label">Label</label>
              <input className="input" placeholder="e.g. Offer accepted" value={newMs.label} onChange={e => setNewMs(p => ({ ...p, label: e.target.value }))} />
            </div>
            <div style={{ minWidth: 140 }}>
              <label className="field-label">Date</label>
              <input className="input" type="date" value={newMs.date} onChange={e => setNewMs(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div style={{ minWidth: 120 }}>
              <label className="field-label">Type</label>
              <select className="input" value={newMs.type} onChange={e => setNewMs(p => ({ ...p, type: e.target.value as NewMilestone['type'] }))}>
                <option value="key">Key date</option>
                <option value="deadline">Deadline</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 7, paddingBottom: 1 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddMs(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={addMilestone} disabled={saving}>Add</button>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{done} of {total} tasks complete</span>
          <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 500 }}>{pct}%</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddTask(v => !v)}>+ Add Task</button>
      </div>
      <div className="progress-bar-wrap" style={{ marginBottom: '1rem' }}>
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>

      {/* Add task form */}
      {showAddTask && (
        <div className="card card-p" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>New Task</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input className="input" placeholder="Task title *" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
            <input className="input" placeholder="Details (optional)" value={newTask.detail} onChange={e => setNewTask(p => ({ ...p, detail: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" style={{ flex: 1 }} placeholder="Due / timing" value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} />
              <select className="input" style={{ width: 130 }} value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value as '' | 'Justin' | 'Natalie' }))}>
                <option value="">Unassigned</option>
                <option value="Justin">Justin</option>
                <option value="Natalie">Natalie</option>
              </select>
            </div>
            <select className="input" value={newTask.phase} onChange={e => setNewTask(p => ({ ...p, phase: e.target.value }))}>
              {PHASES.map((label, i) => <option key={i} value={String(i)}>{label}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddTask(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={addTask} disabled={saving}>Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Task list by phase */}
      {byPhase.map(({ label, items }, idx) => (
        <div key={idx} style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
            {label}
          </div>
          {items.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingLeft: 2 }}>No tasks</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map(task => (
                <div key={task.id} className={`task${task.done ? ' done' : ''}`} onClick={() => toggleTask(task)}>
                  <div className={`task-check${task.done ? '' : ''}`}>
                    {task.done && <div className="checkmark" />}
                  </div>
                  <div className="task-body">
                    <div className="task-title">{task.title}</div>
                    {task.detail && <div className="task-detail">{task.detail}</div>}
                  </div>
                  {task.due && <span className="task-due">{task.due}</span>}
                  {task.assignee && (
                    <span className={`task-assignee assignee-${task.assignee.toLowerCase()}`}>{task.assignee}</span>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 10, padding: '2px 6px', opacity: 0.4 }}
                    onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
