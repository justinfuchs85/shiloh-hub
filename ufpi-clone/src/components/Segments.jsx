import React, { useState } from 'react'
import './Segments.css'

const segments = [
  {
    id: 'retail',
    name: 'UFP Retail Solutions',
    tagline: 'From the store shelf to the backyard',
    description:
      'UFP Retail Solutions serves the retail channel with a broad range of residential lumber, decking, fencing, and outdoor living products. We partner with top home improvement retailers to bring quality products to homeowners across North America.',
    features: ['Decking & Railing', 'Fencing & Privacy', 'ProWood® Treated Lumber', 'Garden & Landscape'],
    color: '#F47920',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="28" width="48" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M4 28 L32 8 L60 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <rect x="24" y="38" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="14" y="34" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="40" y="34" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'construction',
    name: 'UFP Construction',
    tagline: 'Building the structures that shape communities',
    description:
      'UFP Construction supplies engineered wood products, wall panels, roof trusses, and structural framing components to professional builders and contractors. Our precision manufacturing ensures faster builds and more efficient construction.',
    features: ['Wall Panels & Systems', 'Roof & Floor Trusses', 'LVL & Engineered Wood', 'Concrete Forming'],
    color: '#002855',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="44" height="36" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M10 20 L32 6 L54 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" strokeWidth="2"/>
        <line x1="10" y1="44" x2="54" y2="44" stroke="currentColor" strokeWidth="2"/>
        <line x1="32" y1="20" x2="32" y2="56" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'packaging',
    name: 'UFP Packaging',
    tagline: 'Protecting products. Enabling commerce.',
    description:
      'UFP Packaging provides industrial packaging solutions including wooden crates, pallets, and specialty protective packaging. We serve manufacturers across diverse industries who need reliable, customized packaging for their products.',
    features: ['Wood Crates & Boxes', 'Custom Pallets', 'Steel & Foam Packaging', 'Global Export Crating'],
    color: '#5a6e2e',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="20" width="40" height="36" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M12 20 L32 10 L52 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <line x1="12" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="2"/>
        <line x1="32" y1="10" x2="32" y2="56" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="38" x2="52" y2="38" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
]

export default function Segments() {
  const [active, setActive] = useState(null)

  return (
    <section id="segments" className="segments">
      <div className="segments__inner">
        <div className="segments__header">
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">Three Markets. One Mission.</h2>
          <p className="section-sub">
            Our three operating segments manufacture and deliver value-added products used in
            residential and commercial construction, outdoor living, packaging, and industrial
            applications worldwide.
          </p>
        </div>

        <div className="segments__grid">
          {segments.map((seg) => (
            <div
              key={seg.id}
              id={seg.id}
              className={`segment-card ${active === seg.id ? 'segment-card--active' : ''}`}
              style={{ '--seg-color': seg.color }}
              onMouseEnter={() => setActive(seg.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="segment-card__icon" style={{ color: seg.color }}>
                {seg.icon}
              </div>
              <h3 className="segment-card__name">{seg.name}</h3>
              <p className="segment-card__tagline">{seg.tagline}</p>
              <p className="segment-card__desc">{seg.description}</p>
              <ul className="segment-card__features">
                {seg.features.map((f) => (
                  <li key={f}>
                    <span className="segment-card__bullet" style={{ background: seg.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="segment-card__link" style={{ color: seg.color }}>
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
