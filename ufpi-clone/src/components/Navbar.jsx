import React, { useState, useEffect } from 'react'
import './Navbar.css'

const navItems = [
  {
    label: 'About',
    href: '#about',
    dropdown: [
      { label: 'Our Company', href: '#about' },
      { label: 'Leadership', href: '#about' },
      { label: 'History', href: '#about' },
      { label: 'Sustainability', href: '#about' },
    ],
  },
  {
    label: 'Markets',
    href: '#segments',
    dropdown: [
      { label: 'UFP Retail Solutions', href: '#retail' },
      { label: 'UFP Construction', href: '#construction' },
      { label: 'UFP Packaging', href: '#packaging' },
    ],
  },
  {
    label: 'Products',
    href: '#segments',
    dropdown: [
      { label: 'Decking & Fencing', href: '#' },
      { label: 'Structural Components', href: '#' },
      { label: 'Industrial Packaging', href: '#' },
      { label: 'ProWood Treated Lumber', href: '#' },
    ],
  },
  { label: 'News', href: '#news', dropdown: null },
  { label: 'Careers', href: '#careers', dropdown: null },
  { label: 'Investors', href: '#investors', dropdown: null },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <a href="#hero" className="navbar__logo">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="40" rx="2" fill="transparent"/>
            <text x="2" y="28" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="22" fill={scrolled ? '#002855' : '#ffffff'}>
              UFP
            </text>
            <text x="56" y="28" fontFamily="Montserrat, sans-serif" fontWeight="400" fontSize="11" fill={scrolled ? '#F47920' : '#F47920'} letterSpacing="1">
              INDUSTRIES
            </text>
          </svg>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="navbar__item"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href={item.href} className="navbar__link">
                {item.label}
                {item.dropdown && <span className="navbar__chevron">▾</span>}
              </a>
              {item.dropdown && activeDropdown === item.label && (
                <ul className="navbar__dropdown">
                  {item.dropdown.map((sub) => (
                    <li key={sub.label}>
                      <a href={sub.href} className="navbar__dropdown-link">
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Search + Mobile Toggle */}
        <div className="navbar__actions">
          <button className="navbar__search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
