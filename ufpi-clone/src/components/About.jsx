import React, { useEffect, useRef, useState } from 'react'
import './About.css'

const stats = [
  { value: '15,000+', label: 'Team Members' },
  { value: '200+', label: 'Facilities Worldwide' },
  { value: '1955', label: 'Year Founded' },
  { value: '$8B+', label: 'Annual Net Sales' },
]

function AnimatedStat({ value }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <span ref={ref} className={`stat__value ${visible ? 'stat__value--visible' : ''}`}>
      {value}
    </span>
  )
}

export default function About() {
  return (
    <section id="about" className="about">
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-bar__inner">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <AnimatedStat value={s.value} />
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About content */}
      <div className="about__inner">
        <div className="about__image-col">
          <div className="about__image-wrap">
            {/* Placeholder representing industrial/lumber imagery */}
            <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="about__illustration">
              {/* Background */}
              <rect width="560" height="420" fill="#001f4d"/>
              {/* Large warehouse / structure */}
              <rect x="40" y="120" width="480" height="260" rx="4" fill="#002855"/>
              {/* Roof */}
              <polygon points="20,120 280,40 540,120" fill="#003580"/>
              {/* Windows */}
              {[80,180,280,380,460].map((x,i) => (
                <rect key={i} x={x} y="160" width="60" height="80" rx="3" fill="#F4792033"/>
              ))}
              {/* Doors */}
              <rect x="220" y="280" width="120" height="100" rx="3" fill="#F4792022"/>
              <rect x="230" y="310" width="46" height="70" rx="2" fill="#F47920"/>
              <rect x="284" y="310" width="46" height="70" rx="2" fill="#F47920"/>
              {/* Text overlay */}
              <text x="280" y="395" textAnchor="middle" fontFamily="Montserrat, sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.3)" letterSpacing="3">
                UFP INDUSTRIES
              </text>
              {/* Decorative lines (lumber boards) */}
              {[0,1,2,3].map((i) => (
                <rect key={i} x="50" y={60 + i*12} width="200" height="6" rx="2" fill={`rgba(244,121,32,${0.15 + i*0.05})`}/>
              ))}
            </svg>
            <div className="about__image-badge">
              <span className="about__image-badge-year">Est. 1955</span>
              <span className="about__image-badge-text">Grand Rapids, Michigan</span>
            </div>
          </div>
        </div>

        <div className="about__text-col">
          <span className="section-eyebrow">Who We Are</span>
          <h2 className="section-title">A company of builders, makers, and problem solvers</h2>
          <p className="about__body">
            UFP Industries was founded in 1955 with a simple premise: do right by your customers,
            your teammates, and the communities you serve. Today, more than 70 years later, that
            same entrepreneurial spirit drives everything we do.
          </p>
          <p className="about__body">
            We are North America's largest converter of softwood lumber and the world's largest
            pressure-treater — with scale advantages in sourcing that we pass directly to our
            customers. Driven by strategic diversification and high employee ownership, we are
            focused on delivering above-market growth and compounding margins over time.
          </p>

          <div className="about__pillars">
            {[
              { icon: '🤝', title: 'Integrity First', desc: 'We do what we say we will do — always.' },
              { icon: '💡', title: 'Entrepreneurial Spirit', desc: 'Ownership thinking at every level of our business.' },
              { icon: '🌱', title: 'Sustainability', desc: 'Responsibly sourced wood and a greener supply chain.' },
            ].map((p) => (
              <div key={p.title} className="about__pillar">
                <span className="about__pillar-icon">{p.icon}</span>
                <div>
                  <h4 className="about__pillar-title">{p.title}</h4>
                  <p className="about__pillar-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="btn btn--primary">Read Our Story</a>
        </div>
      </div>
    </section>
  )
}
