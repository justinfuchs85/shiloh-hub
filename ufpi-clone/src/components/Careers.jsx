import React from 'react'
import './Careers.css'

const perks = [
  { icon: '📈', title: 'Employee Ownership', desc: 'Share in the success — UFP has high employee ownership in the business.' },
  { icon: '🌎', title: 'Global Reach', desc: 'Work with affiliates across North America, Europe, Asia, and Australia.' },
  { icon: '🏗️', title: 'Build Something Real', desc: 'Your work contributes to the physical world — buildings, packaging, homes.' },
  { icon: '🤝', title: 'Entrepreneurial Culture', desc: 'Drive your own path. We hire driven people and get out of their way.' },
]

export default function Careers() {
  return (
    <section id="careers" className="careers">
      <div className="careers__inner">
        <div className="careers__header">
          <span className="section-eyebrow">Join Our Team</span>
          <h2 className="section-title">Sound like your kind of culture?</h2>
          <p className="section-sub">
            We thrive on hard work, an entrepreneurial spirit, and a commitment to integrity.
            We're always looking for driven people ready to make a difference.
          </p>
        </div>

        <div className="careers__perks">
          {perks.map((p) => (
            <div key={p.title} className="perk-card">
              <span className="perk-card__icon">{p.icon}</span>
              <h4 className="perk-card__title">{p.title}</h4>
              <p className="perk-card__desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="careers__cta">
          <p className="careers__cta-text">
            More than 15,000 people strong — and we're still growing.
          </p>
          <a href="#" className="btn btn--primary btn--large">Explore Open Positions</a>
        </div>
      </div>
    </section>
  )
}
