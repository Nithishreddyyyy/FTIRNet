import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import OverviewCards from './components/OverviewCards'

function App() {
  return (
    <div className="relative min-h-screen selection:bg-primary-500/30 font-sans text-gray-100 overflow-x-hidden">
      {/* Global Background Gradient Map/Noise could go here if not in CSS */}
      <Navbar />
      <main>
        <Hero />
        <OverviewCards />
      </main>
      
      {/* Simple Footer Placeholder */}
      <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-gray-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} Microplastics Detection & Analysis System. Phase 1.</p>
      </footer>
    </div>
  )
}

export default App
