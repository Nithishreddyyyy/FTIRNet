import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Activity, 
  Cpu, 
  RotateCcw, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Hash, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Search,
  Zap
} from 'lucide-react';

const DeepLearningFTIRAnalysis = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedModel, setSelectedModel] = useState('CNN Model');
  const [progress, setProgress] = useState(0);

  const models = ['CNN Model', 'Random Forest Model', 'Hybrid Model'];

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
      setFile({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + ' KB',
        timestamp: new Date().toLocaleString(),
        status: 'Ready'
      });
    }
  };

  const runAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        polymer: 'Polyethylene (PE)',
        confidence: 98.4,
        risk: 'High',
        model: selectedModel,
        sampleId: 'FTIR-' + Math.floor(Math.random() * 10000),
        processingTime: '1.2s',
        peaks: 12,
        status: 'Verified'
      });
    }, 3000);
  };

  const reset = () => {
    setFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Cpu className="text-primary-500 w-10 h-10" />
              <span className="text-gradient">DeepLearning FTIR Analysis</span>
            </h1>
            <p className="text-gray-400 mt-2">Professional AI-powered scientific spectral analysis laboratory</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            System Status: <span className="text-emerald-400 font-medium">Optimal</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE — Upload & Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CSV Upload Area */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className="bg-glow opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 group-hover:border-primary-500/50 rounded-2xl p-10 transition-all duration-500 bg-white/[0.02]">
                <div className="p-4 bg-primary-500/10 rounded-full group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">Upload FTIR Dataset</h3>
                <p className="text-sm text-gray-500 mt-1">Supports .csv FTIR spectral datasets</p>
                
                <label className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-full cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                  Browse CSV
                  <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                </label>
              </div>
            </motion.div>

            {/* File Details Card */}
            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-6 border-l-4 border-l-emerald-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} • {file.timestamp}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Model Selection & Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Select Neural Model</label>
                <div className="relative group">
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer transition-all"
                  >
                    {models.map(m => <option key={m} value={m} className="bg-dark-bg">{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={runAnalysis}
                  disabled={!file || isAnalyzing}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group
                    ${(!file || isAnalyzing) ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 animate-spin" /> Analyzing...
                    </span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Run Analysis
                    </>
                  )}
                  {file && !isAnalyzing && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[45deg]" />}
                </button>
                <button 
                  onClick={reset}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE — Analysis Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                /* Processing State UI */
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-12 relative overflow-hidden"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Rotating rings */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 border-4 border-primary-500/20 border-t-primary-500 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-4 border-accent-500/20 border-b-accent-500 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-12 h-12 text-primary-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-64 text-center space-y-6 w-full max-w-sm">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Analyzing FTIR Spectral Data...</h3>
                      <p className="text-gray-500 text-sm">Deep learning model is scanning 4,000+ absorption points</p>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                      />
                    </div>
                    <p className="text-xs font-mono text-primary-400">{progress}% Processed</p>
                  </div>
                </motion.div>
              ) : analysisResult ? (
                /* Results UI */
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="text-primary-500" />
                      FTIR Polymer Detection Results
                    </h2>
                    <span className="text-xs font-mono text-gray-500">REF: {analysisResult.sampleId}</span>
                  </div>

                  {/* Main Result Card */}
                  <div className="glass-card p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Activity className="w-32 h-32 text-primary-500" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Predicted Polymer Type</p>
                          <h2 className="text-3xl font-bold text-white tracking-wide">{analysisResult.polymer}</h2>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
                            <p className="text-xs text-gray-500 mb-1">Confidence</p>
                            <div className="flex items-baseline gap-1">
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-bold text-emerald-400"
                              >
                                {analysisResult.confidence}%
                              </motion.span>
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
                            <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                            <span className={`text-lg font-bold ${analysisResult.risk === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                              {analysisResult.risk}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Analysis Model</p>
                          <div className="flex items-center gap-2 text-white font-medium">
                            <Cpu className="w-4 h-4 text-primary-400" />
                            {analysisResult.model}
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-gray-300">Neural Network Classification Success</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spectrum Visualization Placeholder */}
                  <div className="glass-card p-6 h-64 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-400">FTIR Spectrum Absorption Profile</h3>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <div className="w-2 h-2 rounded-full bg-accent-500" />
                      </div>
                    </div>
                    
                    {/* Mock Graph Visualization */}
                    <div className="relative w-full h-40 mt-4">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
                          </linearGradient>
                        </defs>
                        <motion.path 
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          d="M0,80 Q50,20 100,60 T200,40 T300,90 T400,20 T500,70 T600,40 T700,85 T800,30" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="3"
                          className="w-full"
                        />
                        {/* Peak Points */}
                        {[100, 300, 500, 700].map((x, i) => (
                          <motion.circle 
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5 + i * 0.2 }}
                            cx={x} cy={i % 2 === 0 ? 60 : 20} r="4" 
                            fill="#0ea5e9"
                            className="drop-shadow-[0_0_8px_#0ea5e9]"
                          />
                        ))}
                      </svg>
                      
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-8 gap-4 pointer-events-none opacity-10">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="border-l border-white h-full" />
                        ))}
                      </div>
                      <div className="absolute inset-0 grid grid-rows-4 gap-4 pointer-events-none opacity-10">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="border-t border-white w-full" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-[10px] font-mono text-gray-600">
                      <span>4000 cm⁻¹</span>
                      <span>3000 cm⁻¹</span>
                      <span>2000 cm⁻¹</span>
                      <span>1500 cm⁻¹</span>
                      <span>1000 cm⁻¹</span>
                      <span>500 cm⁻¹</span>
                    </div>
                  </div>

                  {/* Additional Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Sample ID', value: analysisResult.sampleId, icon: Hash },
                      { label: 'Processing', value: analysisResult.processingTime, icon: Clock },
                      { label: 'Peaks Found', value: analysisResult.peaks, icon: TrendingUp },
                      { label: 'Status', value: analysisResult.status, icon: CheckCircle2 }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="glass-card p-4 hover:bg-white/10 transition-colors group"
                      >
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-3.5 h-3.5 text-primary-400 group-hover:scale-110 transition-transform" />
                          <span className="text-white font-bold text-sm">{stat.value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/10">
                    <Search className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready for Analysis</h3>
                  <p className="text-gray-500 max-w-sm">Upload a CSV dataset on the left to begin the Deep Learning FTIR spectral classification process.</p>
                  
                  <div className="mt-12 grid grid-cols-3 gap-8 opacity-30">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-1 bg-white/20 rounded-full" />
                      <div className="w-8 h-1 bg-white/20 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-1 bg-white/20 rounded-full" />
                      <div className="w-12 h-1 bg-white/20 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-1 bg-white/20 rounded-full" />
                      <div className="w-10 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Recent Analysis Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="text-primary-500 w-5 h-5" />
              Recent Spectral Analyses
            </h3>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View All History</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Micro_Sample_012.csv', type: 'Polypropylene (PP)', confidence: '94.2%', time: '2 hours ago' },
              { name: 'Ocean_Debris_X9.csv', type: 'Polystyrene (PS)', confidence: '91.8%', time: '5 hours ago' },
              { name: 'Beach_Sediment_03.csv', type: 'PET', confidence: '96.5%', time: 'Yesterday' }
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 hover:bg-white/10 transition-all group flex items-center gap-4">
                <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <FileText className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{item.type}</span>
                    <span className="text-[10px] text-gray-500 tracking-tighter">•</span>
                    <span className="text-[10px] text-gray-500">{item.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-emerald-500 font-bold">{item.confidence}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent-500/10 blur-[120px] rounded-full" />
        
        {/* Floating Particles Mock */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/3 w-1 h-1 bg-primary-400 rounded-full shadow-[0_0_10px_#0ea5e9]"
        />
        <motion.div 
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-accent-400 rounded-full shadow-[0_0_10px_#8b5cf6]"
        />
      </div>
    </div>
  );
};

export default DeepLearningFTIRAnalysis;
