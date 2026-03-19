import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { ShoppingItem, ShoppingRoom } from '../types'

const PRIORITY_CLASS: Record<string, string> = {
  'Must have': 'priority-must',
  'Nice to have': 'priority-nice',
  'Someday': 'priority-someday',
}
const STATUS_CLASS: Record<string, string> = {
  'Need to buy': 'status-need',
  'Ordered': 'status-ordered',
  'Delivered': 'status-delivered',
  'Done': 'status-done',
}

const blankForm = () => ({
  name: '', room: '', priority: 'Must have', status: 'Need to buy',
  store: '', priceEst: '', priceActual: '', dims: '', qty: 1,
  assignee: '', link: '', notes: '', image: '',
})

export default function Shopping() {
  const [rooms, setRooms] = useState<ShoppingRoom[]>([])
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRoom, setFilterRoom] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [form, setForm] = useState(blankForm())
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | number | null>(null)

  const load = () =>
    Promise.all([
      api.getAll<ShoppingRoom>('shopping-rooms', { sort: 'order' }),
      api.getAll<ShoppingItem>('shopping-items', { sort: 'order', depth: 1 }),
    ]).then(([r, i]) => { setRooms(r); setItems(i) }).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const toggleDone = async (item: ShoppingItem) => {
    const updated = { ...item, done: !item.done }
    setItems(prev => prev.map(i => i.id === item.id ? updated : i))
    await api.update('shopping-items', item.id, { done: !item.done })
  }

  const saveItem = async () => {
    if (!form.name.trim() || !form.room) return
    setSaving(true)
    try {
      if (editId !== null) {
        const updated = await api.update<ShoppingItem>('shopping-items', editId, form)
        setItems(prev => prev.map(i => i.id === editId ? updated : i))
        setEditId(null)
      } else {
        const created = await api.create<ShoppingItem>('shopping-items', { ...form, done: false, order: items.length })
        setItems(prev => [...prev, created])
      }
      setForm(blankForm())
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  const removeItem = async (id: string | number) => {
    setItems(prev => prev.filter(i => i.id !== id))
    await api.delete('shopping-items', id)
  }

  const addRoom = async () => {
    if (!newRoomName.trim()) return
    const created = await api.create<ShoppingRoom>('shopping-rooms', { name: newRoomName, order: rooms.length })
    setRooms(prev => [...prev, created])
    setNewRoomName('')
    setShowAddRoom(false)
  }

  const getRoomId = (room: ShoppingItem['room']) => {
    if (!room) return ''
    if (typeof room === 'object') return String((room as ShoppingRoom).id)
    return String(room)
  }
  const getRoomName = (room: ShoppingItem['room']) => {
    if (!room) return '—'
    if (typeof room === 'object') return (room as ShoppingRoom).name
    const r = rooms.find(rm => String(rm.id) === String(room))
    return r?.name ?? '—'
  }

  const visibleItems = items.filter(item => {
    if (filterRoom && getRoomId(item.room) !== filterRoom) return false
    if (filterStatus && item.status !== filterStatus) return false
    return true
  })

  const needToBuy = items.filter(i => !i.done)
  const priceSum = needToBuy.reduce((s, i) => {
    const p = parseFloat((i.priceEst ?? '').replace(/[$,]/g, '')) || 0
    return s + p * (i.qty || 1)
  }, 0)

  // Group by room
  const grouped = rooms.map(room => ({
    room,
    items: visibleItems.filter(i => getRoomId(i.room) === String(room.id)),
  })).filter(g => g.items.length > 0)

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{needToBuy.length} items remaining</span>
          {priceSum > 0 && <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 500 }}>Est. ${priceSum.toLocaleString()}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 130 }} value={filterRoom} onChange={e => setFilterRoom(e.target.value)}>
            <option value="">All rooms</option>
            {rooms.map(r => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
          </select>
          <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All statuses</option>
            {['Need to buy', 'Ordered', 'Delivered', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(v => !v); setEditId(null); setForm(blankForm()) }}>+ Add Item</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAddRoom(v => !v)}>+ Room</button>
        </div>
      </div>

      {/* Add room */}
      {showAddRoom && (
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <input className="input" placeholder="Room name" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRoom()} />
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAddRoom(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={addRoom}>Add</button>
        </div>
      )}

      {/* Add item form */}
      {showForm && (
        <div className="card card-p" style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {editId !== null ? 'Edit item' : 'New item'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Item name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <select className="input" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))}>
              <option value="">Select room *</option>
              {rooms.map(r => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              {['Must have', 'Nice to have', 'Someday'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input className="input" placeholder="Store / brand" value={form.store} onChange={e => setForm(p => ({ ...p, store: e.target.value }))} />
            <input className="input" placeholder="Est. price ($)" value={form.priceEst} onChange={e => setForm(p => ({ ...p, priceEst: e.target.value }))} />
            <input className="input" placeholder="Dimensions" value={form.dims} onChange={e => setForm(p => ({ ...p, dims: e.target.value }))} />
            <input className="input" type="number" min={1} placeholder="Qty" value={form.qty} onChange={e => setForm(p => ({ ...p, qty: Number(e.target.value) }))} />
            <select className="input" value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}>
              <option value="">Unassigned</option>
              <option value="Justin">Justin</option>
              <option value="Natalie">Natalie</option>
            </select>
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Product URL" type="url" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} />
            <input className="input" style={{ gridColumn: '1/-1' }} placeholder="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveItem} disabled={saving}>{editId !== null ? 'Save' : 'Add item'}</button>
          </div>
        </div>
      )}

      {/* Room groups */}
      {grouped.length === 0 && (
        <div className="empty">No items yet — add some above.</div>
      )}
      {grouped.map(({ room, items: roomItems }) => (
        <div key={room.id} className="shop-room">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="shop-room-name">{room.name}</span>
            <span style={{ fontSize: 10, color: 'var(--warm-faint)' }}>{roomItems.length} item{roomItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {roomItems.map(item => (
              <div key={item.id} className={`shop-item${item.done ? ' done-item' : ''}`}>
                <div
                  className="task-check"
                  style={item.done ? { background: 'var(--teal)', borderColor: 'var(--teal)', cursor: 'pointer' } : { cursor: 'pointer' }}
                  onClick={() => toggleDone(item)}
                >
                  {item.done && <div className="checkmark" />}
                </div>
                {item.image && <img src={item.image} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} alt={item.name} onError={e => (e.currentTarget.style.display = 'none')} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="shop-item-name">{item.name}{item.qty > 1 ? ` ×${item.qty}` : ''}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                    <span className={`shop-badge ${PRIORITY_CLASS[item.priority] ?? ''}`}>{item.priority}</span>
                    <span className={`shop-badge ${STATUS_CLASS[item.status] ?? ''}`}>{item.status}</span>
                    {item.store && <span className="shop-badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{item.store}</span>}
                    {item.priceEst && <span className="shop-badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{item.priceEst}</span>}
                    {item.assignee && <span className={`task-assignee assignee-${item.assignee.toLowerCase()}`}>{item.assignee}</span>}
                  </div>
                  {item.notes && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{item.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={e => e.stopPropagation()}>↗</a>}
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => { setEditId(item.id); setForm({ name: item.name, room: getRoomId(item.room), priority: item.priority, status: item.status, store: item.store ?? '', priceEst: item.priceEst ?? '', priceActual: item.priceActual ?? '', dims: item.dims ?? '', qty: item.qty, assignee: item.assignee ?? '', link: item.link ?? '', notes: item.notes ?? '', image: item.image ?? '' }); setShowForm(true) }}>✏</button>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bookmarklet instructions */}
      <div className="card card-p" style={{ marginTop: '2rem', background: 'var(--bg-info)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-info)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bookmarklet</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          The <code style={{ background: 'var(--bg-secondary)', padding: '1px 4px', borderRadius: 3 }}>bookmarklet.js</code> file in this repo can be used to save items from Amazon, Walmart, and other sites directly to Shopping. Drag it to your bookmarks bar and click it on any product page.
        </div>
      </div>
    </>
  )
}
