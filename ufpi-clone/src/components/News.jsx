import React from 'react'
import './News.css'

const newsItems = [
  {
    date: 'February 19, 2026',
    category: 'Financial',
    title: 'UFP Industries Announces Fourth Quarter and Full Year 2025 Results',
    excerpt:
      'UFP Industries reported strong full-year results driven by strategic diversification across its Retail, Packaging, and Construction segments, with net sales exceeding $8 billion for the year.',
    href: '#',
  },
  {
    date: 'November 6, 2025',
    category: 'Financial',
    title: 'UFP Industries Announces Third Quarter 2025 Results',
    excerpt:
      'UFP Industries reported Q3 2025 results with liquidity of approximately $2.3 billion, consisting of $1.0 billion of cash and $1.3 billion of revolving credit availability.',
    href: '#',
  },
  {
    date: 'August 7, 2025',
    category: 'Financial',
    title: 'UFP Industries Announces Second Quarter 2025 Results',
    excerpt:
      'As a leading manufacturer focused on delivering value-added products, UFP Industries reported Q2 2025 net sales of $1.84 billion across its Retail, Packaging, and Construction segments.',
    href: '#',
  },
  {
    date: 'May 1, 2025',
    category: 'Financial',
    title: 'UFP Industries Announces First Quarter 2025 Results',
    excerpt:
      'UFP Industries continued to execute on its strategic plan in Q1 2025, with above-market growth momentum supported by high employee ownership and best-in-class ROIC performance.',
    href: '#',
  },
  {
    date: 'March 15, 2025',
    category: 'ESG',
    title: 'UFP Industries Releases Annual Governance & Sustainability Report',
    excerpt:
      'UFP Industries published its FY 2024 Governance Report, highlighting progress on sustainability initiatives, responsible sourcing practices, and community investment programs.',
    href: '#',
  },
  {
    date: 'January 22, 2025',
    category: 'Corporate',
    title: 'UFP Industries Expands UFP Packaging with New Facility in Southeast U.S.',
    excerpt:
      'UFP Packaging announced the opening of a new state-of-the-art manufacturing facility, expanding its industrial packaging capacity to better serve customers across the region.',
    href: '#',
  },
]

const categoryColors = {
  Financial: '#002855',
  ESG: '#5a6e2e',
  Corporate: '#F47920',
}

export default function News() {
  const [featured, ...rest] = newsItems

  return (
    <section id="news" className="news">
      <div className="news__inner">
        <div className="news__header">
          <span className="section-eyebrow">Latest Updates</span>
          <h2 className="section-title">News &amp; Press Releases</h2>
        </div>

        <div className="news__layout">
          {/* Featured / latest story */}
          <a href={featured.href} className="news-featured">
            <div className="news-featured__bg">
              <svg viewBox="0 0 680 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                <rect width="680" height="400" fill="#001f4d"/>
                <circle cx="340" cy="200" r="280" fill="rgba(244,121,32,0.06)"/>
                <circle cx="100" cy="350" r="200" fill="rgba(0,53,128,0.3)"/>
                {[...Array(8)].map((_,i)=>(
                  <rect key={i} x={30+i*80} y={80+i*20} width={200-i*15} height="8" rx="2" fill={`rgba(244,121,32,${0.08+i*0.03})`}/>
                ))}
                <text x="340" y="360" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="11" fill="rgba(255,255,255,0.2)" letterSpacing="4">UFP INDUSTRIES</text>
              </svg>
            </div>
            <div className="news-featured__content">
              <span
                className="news-tag"
                style={{ background: categoryColors[featured.category] }}
              >
                {featured.category}
              </span>
              <p className="news-featured__date">{featured.date}</p>
              <h3 className="news-featured__title">{featured.title}</h3>
              <p className="news-featured__excerpt">{featured.excerpt}</p>
              <span className="news-featured__cta">Read Full Release →</span>
            </div>
          </a>

          {/* Sidebar list */}
          <div className="news__list">
            {rest.map((item) => (
              <a key={item.title} href={item.href} className="news-item">
                <div className="news-item__meta">
                  <span
                    className="news-tag news-tag--small"
                    style={{ background: categoryColors[item.category] }}
                  >
                    {item.category}
                  </span>
                  <span className="news-item__date">{item.date}</span>
                </div>
                <h4 className="news-item__title">{item.title}</h4>
                <p className="news-item__excerpt">{item.excerpt}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="news__footer">
          <a href="#" className="btn btn--outline-dark">View All News</a>
        </div>
      </div>
    </section>
  )
}
