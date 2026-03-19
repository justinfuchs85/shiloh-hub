import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { QuickLink } from '../types'

export default function Details() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAll<QuickLink>('quick-links', { sort: 'order' })
      .then(setLinks).finally(() => setLoading(false))
  }, [])

  const addLink = async () => {
    if (!newLabel.trim() || !newUrl.trim()) return
    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
    const created = await api.create<QuickLink>('quick-links', { label: newLabel, url, order: links.length })
    setLinks(prev => [...prev, created])
    setNewLabel('')
    setNewUrl('')
  }

  const deleteLink = async (id: string | number) => {
    setLinks(prev => prev.filter(l => l.id !== id))
    await api.delete('quick-links', id)
  }

  return (
    <>
      <div className="two-col">
        <div>
          <div className="section-title">Property details</div>
          <div className="card card-p">
            {[
              ['Style', '2-story, single family'],
              ['Year built', '2001'],
              ['Floor area', '1,726 sqft above grade'],
              ['Basement', '768 sqft (614 sqft finished)'],
              ['Garage', '484 sqft attached, built 2001'],
              ['Deck', '828 sqft treated wood'],
              ['Lot', '0.33 acres — 108 ft × 133 ft'],
              ['Heating / cooling', 'Forced heat & cool'],
              ['Fireplace', '1 prefab, 2-story'],
              ['Parcel #', '41-18-12-204-011'],
              ['Legal', 'Lot 46 · Shiloh Hills Plats'],
              ['Zoning', 'R1-C Residential'],
              ['School district', 'Forest Hills Public Schools'],
              ['Estimated TCV', '$305,150'],
              ['Zestimate', '$470,900'],
              ['Rent Zestimate', '$3,058/mo'],
            ].map(([label, value]) => (
              <div className="info-row" key={label}>
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>

          <div className="section-title">Sale &amp; price history</div>
          <div className="card card-p">
            {[
              ['Mar 2026', 'Listed', '$500,000'],
              ['Nov 2025', 'Listed / removed', '$479,500'],
              ['Sep–Nov 2025', 'Listed / removed', '$509,900–$519,000'],
              ['Aug 2025', 'Listed', '$525,000'],
              ['Jun 2020', 'Sold (Graham ← Thibault)', '$310,000'],
              ['Aug 2002', 'Sold (Thibault)', '$189,900'],
            ].map(([date, desc, price]) => (
              <div key={date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '1px solid var(--border-3)', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{date}</span>
                <span>{desc}</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{price}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">Tax record — BS&A 2026</div>
          <div className="card card-p">
            {[
              ['Current owner', 'Graham, David R'],
              ['Assessed value (2026)', '$214,100'],
              ['State equalized value', '$214,100'],
              ['Taxable value (2026)', '$167,433'],
              ['Principal residence exemption', '100% (since Jun 2020)'],
            ].map(([label, value]) => (
              <div className="info-row" key={label}>
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '0.5px solid var(--border-3)', margin: '6px 0' }} />
            {[
              ['2025 assessed / taxable', '$202,500 / $163,032'],
              ['2024 assessed / taxable', '$196,500 / $158,130'],
              ['2023 assessed / taxable', '$148,600 / $148,600'],
            ].map(([label, value]) => (
              <div className="info-row" key={label} style={{ fontSize: 11 }}>
                <span className="label" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                <span className="value" style={{ color: 'var(--text-secondary)' }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg-warning)', borderRadius: 'var(--r-md)' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-warning)', marginBottom: 3 }}>Tax reassessment warning</div>
              <div style={{ fontSize: 11, color: 'var(--text-warning)', lineHeight: 1.5 }}>
                The current PRE exemption will not transfer. Once the sale closes, the property will be uncapped and reassessed at 50% of market value. At $500,000, expect assessed value ~$250,000 — pushing annual taxes well above the current $6,720.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="section-title" style={{ marginTop: '1.5rem' }}>Quick links</div>
      <div className="card" style={{ padding: '0.75rem 1rem' }}>
        {loading ? <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Loading…</div> : (
          <>
            {links.map(link => (
              <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid var(--border-3)', fontSize: 13 }}>
                <a href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-info)', textDecoration: 'none' }}>{link.label}</a>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => deleteLink(link.id)}>✕</button>
              </div>
            ))}
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '0.5px solid var(--border-3)' }}>
          <input className="input" style={{ width: 160 }} placeholder="Label" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
          <input className="input" style={{ flex: 1 }} placeholder="https://…" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
          <button className="btn btn-secondary btn-sm" onClick={addLink}>+ Add</button>
        </div>
      </div>
    </>
  )
}
