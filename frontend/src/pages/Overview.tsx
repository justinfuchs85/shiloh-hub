import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Task, PropertyGlobal } from '../types'

const HERO_IMGS = [
  { src: 'https://cdn.photos.sparkplatform.com/ric/20260309160847067792000000-o.jpg', alt: 'Front of home' },
  { src: 'https://cdn.photos.sparkplatform.com/ric/20260309160847194875000000-o.jpg', alt: 'Exterior' },
  { src: 'https://cdn.photos.sparkplatform.com/ric/20260311024526231845000000-o.jpg', alt: 'Neighborhood' },
  { src: 'https://cdn.photos.sparkplatform.com/ric/20260309160847304240000000-o.jpg', alt: 'Summer' },
  { src: 'https://cdn.photos.sparkplatform.com/ric/20260309160848849022000000-o.jpg', alt: 'Pool' },
]

const HIGHLIGHTS = [
  'Sparkling pool (above ground)', 'New roof', 'New carpet throughout', 'No HOA',
  '$120k in improvements', 'Forest Hills Northern HS', '2-car attached garage',
  'Fireplace', 'Corner lot — 0.33 acres', 'Finished basement',
  'Washer/dryer included', 'Built 2001',
]

export default function Overview() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [property, setProperty] = useState<PropertyGlobal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getAll<Task>('tasks'),
      api.getGlobal<PropertyGlobal>('property').catch(() => null),
    ]).then(([t, p]) => {
      setTasks(t)
      setProperty(p)
    }).finally(() => setLoading(false))
  }, [])

  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const prop = property
  const price = prop?.offerPrice ?? 500000
  const sqft = prop?.sqft ?? 2042
  const beds = prop?.beds ?? 4
  const bathsFull = prop?.bathsFull ?? 3
  const bathsHalf = prop?.bathsHalf ?? 1
  const taxes = prop?.annualTaxes ?? 6720
  const highlights = prop?.highlights?.map(h => h.text) ?? HIGHLIGHTS

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-main">
          <img src={HERO_IMGS[0].src} alt={HERO_IMGS[0].alt} />
        </div>
        <div className="hero-grid">
          {HERO_IMGS.slice(1).map((img, i) => (
            <img key={i} src={img.src} alt={img.alt} />
          ))}
        </div>
      </div>

      {/* Address bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300, letterSpacing: '0.01em', lineHeight: 1.2 }}>
          {prop?.address ?? '4496 Shiloh Way Dr SE, Kentwood, MI 49546'}
          <span className="badge-inline">{prop?.status ?? 'Offer Accepted'}</span>
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5, letterSpacing: '0.02em' }}>
          MLS #{prop?.mlsNumber ?? '26009064'} &nbsp;·&nbsp; Forest Hills School District &nbsp;·&nbsp; Listed by Ingrid C Anastasiu, Keller Williams GR East
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Offer price</div>
          <div className="stat-value">${price.toLocaleString()}</div>
          <div className="stat-sub">List: ${(prop?.listPrice ?? price).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Size</div>
          <div className="stat-value">{sqft.toLocaleString()} sqft</div>
          <div className="stat-sub">${Math.round(price / sqft)}/sqft</div>
        </div>
        <div className="stat">
          <div className="stat-label">Beds / baths</div>
          <div className="stat-value">{beds} bd / {bathsFull + bathsHalf} ba</div>
          <div className="stat-sub">{bathsFull} full, {bathsHalf} half</div>
        </div>
        <div className="stat">
          <div className="stat-label">Annual taxes</div>
          <div className="stat-value">${taxes.toLocaleString()}</div>
          <div className="stat-sub">${Math.round(taxes / 12)}/mo est.</div>
        </div>
      </div>

      {/* Highlights */}
      <div className="section-title">Highlights</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {highlights.map((h, i) => (
          <span key={i} className="feature-tag">{h}</span>
        ))}
      </div>

      {/* Description */}
      <div className="section-title">Listing description</div>
      <div className="card card-p" style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.8, color: 'var(--warm-mid)', fontWeight: 300 }}>
        {prop?.listingDescription ??
          'With spring around the corner, this beautifully updated 4-bedroom, 4-bath home in the highly desirable Forest Hills School District is ready to enjoy. Located just minutes from the school and close to shopping, dining, the airport and scenic trails, the setting offers both convenience and space. Perched on an elevated 1/3-acre lot, the property features a sparkling pool and large deck — perfect for summer gatherings and outdoor fun.'}
      </div>

      {/* Purchase progress */}
      <div className="section-title" style={{ marginTop: '1.5rem' }}>Purchase progress</div>
      <div className="card card-p">
        {loading ? (
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Loading…</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>{done} of {total} tasks complete</span>
              <span style={{ color: 'var(--text-info)', fontWeight: 500 }}>{pct}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-tertiary)' }}>
              <Link to="/timeline" style={{ color: 'var(--text-info)', textDecoration: 'none' }}>View full timeline →</Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
