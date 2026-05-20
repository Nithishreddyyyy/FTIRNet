import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DeepLearningFTIRAnalysis from './pages/DeepLearningFTIRAnalysis';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import AboutUs from './pages/AboutUs';
import GraphPeakIdentifier from './pages/GraphPeakIdentifier';
import MolecularStructure from './pages/molecular_structure';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="relative min-h-screen selection:bg-primary-500/30 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Global Background Gradient Map/Noise could go here if not in CSS */}
      <Navbar />
      <ChatBot />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ftir-analysis" element={<DeepLearningFTIRAnalysis />} />
          <Route path="/graph-peak" element={<GraphPeakIdentifier />} />
          <Route path="/molecular-structure" element={<MolecularStructure />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;