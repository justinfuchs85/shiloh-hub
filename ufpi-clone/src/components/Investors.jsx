import React from 'react'
import './Investors.css'

const highlights = [
  {
    label: 'NASDAQ',
    value: 'UFPI',
    note: 'Ticker Symbol',
  },
  {
    label: 'Q3 2025 Liquidity',
    value: '$2.3B',
    note: '$1.0B cash + $1.3B revolving credit',
  },
  {
    label: 'Q2 2025 Net Sales',
    value: '$1.84B',
    note: 'Across all three segments',
  },
  {
    label: 'ROIC Focus',
    value: 'Best-in-Class',
    note: 'Strategic goal & commitment',
  },
]

export default function Investors() {
  return (
    <section id="investors" className="investors">
      <div className="investors__inner">
        <div className="investors__text">
          <span className="section-eyebrow" style={{ color: '#F47920' }}>Investor Relations</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>
            Focused on long-term value creation
          </h2>
          <p className="investors__body">
            Driven by our strategic diversification and high employee ownership in the business,
            UFP Industries is focused on driving above-market growth and compounding margins higher
            over time while maintaining best-in-class ROIC.
          </p>
          <p className="investors__body">
            As North America's largest converter of softwood lumber and the world's largest
            pressure-treater, we leverage scale advantages in sourcing while investing in
            value-added adjacencies — including steel, aluminum, corrugate, foam, and composites.
          </p>
          <div className="investors__ctas">
            <a href="https://www.ufpinvestor.com" target="_blank" rel="noreferrer" className="btn btn--primary">
              Investor Relations Site
            </a>
            <a href="#news" className="btn btn--outline">
              Latest Results
            </a>
          </div>
        </div>

        <div className="investors__metrics">
          {highlights.map((h) => (
            <div key={h.label} className="metric-card">
              <p className="metric-card__note">{h.note}</p>
              <p className="metric-card__value">{h.value}</p>
              <p className="metric-card__label">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
