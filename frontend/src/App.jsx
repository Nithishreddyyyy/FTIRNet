import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DeepLearningFTIRAnalysis from './pages/DeepLearningFTIRAnalysis'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <div className="relative min-h-screen selection:bg-primary-500/30 font-sans text-gray-100 overflow-x-hidden">
      {/* Global Background Gradient Map/Noise could go here if not in CSS */}
      <Navbar />
      
      <main> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ftir-analysis" element={<DeepLearningFTIRAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      
      {/* Simple Footer Placeholder */}
      <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-gray-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} Microplastics Detection & Analysis System. Phase 1.</p>
      </footer>
    </div>
  )
}

export default App
