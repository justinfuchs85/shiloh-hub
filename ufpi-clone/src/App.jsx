import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Segments from './components/Segments'
import About from './components/About'
import Investors from './components/Investors'
import News from './components/News'
import Careers from './components/Careers'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Segments />
        <About />
        <Investors />
        <News />
        <Careers />
      </main>
      <Footer />
    </>
  )
}
