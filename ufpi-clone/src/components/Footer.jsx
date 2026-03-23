import React from 'react'
import './Footer.css'

const footerLinks = [
  {
    heading: 'Company',
    links: [
      { label: 'About UFP Industries', href: '#about' },
      { label: 'Leadership Team', href: '#' },
      { label: 'Company History', href: '#' },
      { label: 'Affiliates', href: '#' },
      { label: 'Sustainability', href: '#' },
    ],
  },
  {
    heading: 'Markets',
    links: [
      { label: 'UFP Retail Solutions', href: '#retail' },
      { label: 'UFP Construction', href: '#construction' },
      { label: 'UFP Packaging', href: '#packaging' },
    ],
  },
  {
    heading: 'Investors',
    links: [
      { label: 'Investor Overview', href: 'https://www.ufpinvestor.com' },
      { label: 'News & Press Releases', href: '#news' },
      { label: 'SEC Filings', href: '#' },
      { label: 'Stock Information', href: '#' },
      { label: 'Corporate Governance', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Careers', href: '#careers' },
      { label: 'Contact Us', href: '#' },
      { label: 'Find a Location', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Use', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__top-inner">
          {/* Brand column */}
          <div className="footer__brand">
            <svg width="130" height="44" viewBox="0 0 130 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="30" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="24" fill="#ffffff">UFP</text>
              <text x="60" y="30" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="11" fill="#F47920" letterSpacing="1">INDUSTRIES</text>
            </svg>
            <p className="footer__brand-tagline">
              No mission statement.<br />
              Just people on a mission.™
            </p>
            <p className="footer__brand-address">
              2801 East Beltline Ave NE<br />
              Grand Rapids, Michigan 49525
            </p>
            <div className="footer__social">
              {['LinkedIn', 'Twitter', 'YouTube'].map((s) => (
                <a key={s} href="#" className="footer__social-link" aria-label={s}>
                  {s === 'LinkedIn' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )}
                  {s === 'Twitter' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>
                  )}
                  {s === 'YouTube' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#002855"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="footer__col">
              <h4 className="footer__col-heading">{col.heading}</h4>
              <ul className="footer__col-links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="footer__link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            © {new Date().getFullYear()} UFP Industries, Inc. All rights reserved. NASDAQ: UFPI
          </p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Use</a>
            <a href="#" className="footer__bottom-link">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
