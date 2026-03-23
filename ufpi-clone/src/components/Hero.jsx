import React from 'react'
import './Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      {/* Background video/image overlay */}
      <div className="hero__bg">
        {/* SVG pattern representing industrial/lumber textures */}
        <svg className="hero__pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0 L0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">Powered by People. Driven by Purpose.</p>
          <h1 className="hero__headline">
            No mission statement.<br />
            Just people on a&nbsp;mission.<span className="hero__tm">™</span>
          </h1>
          <p className="hero__sub">
            UFP Industries supplies thousands of products that support the world's physical
            infrastructure, advance major markets, and improve people's lives —
            powered by more than 15,000 people across hundreds of affiliates worldwide.
          </p>
          <div className="hero__ctas">
            <a href="#segments" className="btn btn--primary">Explore Our Markets</a>
            <a href="#about" className="btn btn--outline">About UFP Industries</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="hero__wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  )
}
