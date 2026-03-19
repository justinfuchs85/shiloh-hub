import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import type { ContactsGlobal } from '../types'

type ContactKey = keyof ContactsGlobal

const CONTACTS = [
  { prefix: 'la', label: 'Listing Agent', initials: 'LA', color: 'var(--bg-info)', textColor: 'var(--text-info)' },
  { prefix: 'ba', label: "Buyer's Agent", initials: 'BA', color: '#faeeda', textColor: '#854f0b' },
  { prefix: 'lender', label: 'Lender', initials: 'LN', color: '#e8f2ec', textColor: '#2d6b3f' },
  { prefix: 'inspector', label: 'Home Inspector', initials: 'HI', color: '#e6f1fb', textColor: '#185fa5' },
  { prefix: 'title', label: 'Title / Closing', initials: 'TC', color: '#f0eafc', textColor: '#6b3fa0' },
  { prefix: 'attorney', label: 'Attorney', initials: 'AT', color: 'var(--bg-warning)', textColor: 'var(--text-warning)' },
]

const FIELDS = [
  { key: 'Name', label: 'Name' },
  { key: 'Title', label: 'Title' },
  { key: 'Phone', label: 'Phone' },
  { key: 'Email', label: 'Email' },
  { key: 'Notes', label: 'Notes' },
]

export default function Contacts() {
  const [data, setData] = useState<ContactsGlobal>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getGlobal<ContactsGlobal>('contacts')
      .then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleChange = (key: ContactKey, value: string) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const saveAll = useCallback(async () => {
    setSaving(true)
    try {
      await api.updateGlobal<ContactsGlobal>('contacts', data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [data])

  if (loading) return <div className="loading">Loading…</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="section-title" style={{ margin: 0 }}>Key contacts</div>
        <button className="btn btn-primary btn-sm" onClick={saveAll} disabled={saving}>
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save all'}
        </button>
      </div>

      <div className="contacts-grid">
        {CONTACTS.map(({ prefix, label, initials, color, textColor }) => (
          <div key={prefix} className="contact-card">
            <div className="contact-avatar" style={{ background: color, color: textColor }}>{initials}</div>
            <div className="contact-name" style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 400 }}>{label}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {FIELDS.map(({ key, label: fieldLabel }) => {
                const dataKey = `${prefix}${key}` as ContactKey
                return (
                  <div key={key}>
                    <div className="contact-field-label">{fieldLabel}</div>
                    <input
                      className="contact-input"
                      value={(data[dataKey] as string | undefined) ?? ''}
                      onChange={e => handleChange(dataKey, e.target.value)}
                      placeholder={`Enter ${fieldLabel.toLowerCase()}…`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={saveAll} disabled={saving}>
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save all contacts'}
        </button>
      </div>
    </>
  )
}
