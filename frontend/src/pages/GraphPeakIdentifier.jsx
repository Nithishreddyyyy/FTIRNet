import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Activity,
  LineChart,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Table,
  Zap,
  Download,
} from 'lucide-react';
import api from '../services/api';

const GraphPeakIdentifier = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
      setUploadError(null);
      setFile({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + ' KB',
        rawFile: uploadedFile,
      });
    } else if (uploadedFile) {
      setUploadError('Only .csv files are supported.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
      setUploadError(null);
      setFile({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + ' KB',
        rawFile: uploadedFile,
      });
    } else if (uploadedFile) {
      setUploadError('Only .csv files are supported.');
    }
  };

  const runAnalysis = async () => {
    if (!file || !file.rawFile) return;
    setIsAnalyzing(true);
    setResult(null);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file.rawFile);

    try {
      const response = await api.post('/graph-peak/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      setResult(data);

      // Save to reports
      try {
        await api.post('/reports', {
          title: `Graph Peak Analysis: ${data.sample_id} (${data.polymer})`,
          sample_id: data.sample_id,
          predictions: {
            class: data.polymer,
            confidence: 100, // Hardcoded for peak identifier 
            peaks_found: data.peaks.length,
            peaks: data.peaks,
            image_base64: data.image_base64
          },
          model_used: 'Peak Identifier',
          summary: `Identified ${data.peaks.length} key peaks for ${data.polymer}.`,
          status: 'Completed',
        });
      } catch (err) {
        console.warn("Failed to save report:", err);
      }
    } catch (err) {
      let errorMsg = 'Analysis failed.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(d => d.msg).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setUploadError(errorMsg);
    }

    setIsAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setIsAnalyzing(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-slate-300 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl shadow-xl">
                <LineChart className="text-accent-600 dark:text-accent-500 w-7 h-7" />
              </div>
              <span className="text-gradient">Graph Peak Identifier</span>
            </h1>
            <p className="text-sm text-slate-700 dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed uppercase tracking-wider">
              Spectral Peak Detection & Microplastic Markers
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-black text-slate-800 dark:text-gray-400 bg-white dark:bg-white/5 px-8 py-3 rounded-full border-2 border-slate-300 dark:border-white/10 shadow-xl uppercase tracking-[0.25em]">
            <Activity className="w-5 h-5 text-accent-600 animate-pulse" />
            MODULE: <span className="text-accent-700 dark:text-accent-400">ACTIVE</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDE — Upload */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="glass-card p-8 relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5"
              >
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-10 transition-all duration-500 bg-slate-50/30 dark:bg-white/[0.02] shadow-inner">
                  <div className="p-6 bg-accent-600/10 rounded-full transition-all duration-500 shadow-sm border border-slate-100 dark:border-white/5">
                    <Upload className="w-10 h-10 text-accent-800 dark:text-accent-400" />
                  </div>
                  <h3 className="mt-6 text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase text-center">
                    Upload Spectral Data
                  </h3>
                  <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest text-center">
                    Supports .csv files
                  </p>

                  <label className="mt-10 px-8 py-3.5 bg-slate-900 hover:bg-accent-600 text-white text-[10px] font-black rounded-xl cursor-pointer transition-colors duration-300 uppercase tracking-widest shadow-md">
                    Browse CSV
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {uploadError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-red-600 dark:text-red-400 text-[10px] font-black bg-red-100 dark:bg-red-500/10 px-4 py-2 rounded-xl flex items-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {uploadError}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-8 border-l-8 border-l-accent-600 shadow-2xl bg-white dark:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[var(--heading-color)] font-black text-lg truncate max-w-[220px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
                        {file.size}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-accent-600" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 bg-white dark:bg-white/5"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={runAnalysis}
                  disabled={!file || isAnalyzing}
                  className={`flex-[2] flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all uppercase tracking-widest text-xs
                    ${!file || isAnalyzing 
                      ? 'bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed' 
                      : 'bg-accent-600 text-white hover:-translate-y-1 hover:shadow-xl'}`}
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Zap className="w-5 h-5" /> Extract Peaks</>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="flex-1 py-4 bg-white dark:bg-white/5 hover:bg-gray-50 text-gray-900 dark:text-white border-2 border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] hover:-translate-y-1 transition-all shadow-md"
                >
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE — Results */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card h-[600px] flex flex-col items-center justify-center border-accent-500/30 shadow-2xl bg-white dark:bg-white/5"
                >
                  <div className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 border-8 border-accent-100 dark:border-white/5 border-t-accent-600 rounded-full" />
                    <Activity className="absolute inset-0 m-auto w-10 h-10 text-accent-600 animate-pulse" />
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-[var(--heading-color)]">Finding Peaks...</h3>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Generated Graph */}
                  <div className="glass-card p-6 shadow-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-[var(--heading-color)] uppercase tracking-[0.2em] flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-accent-600" />
                        Identified Spectrum Graph
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                          {result.sample_id}
                        </span>
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = `data:image/png;base64,${result.image_base64}`;
                            a.download = `Graph_${result.sample_id}.png`;
                            a.click();
                          }}
                          className="flex items-center gap-2 text-[10px] font-black text-accent-700 bg-accent-100 dark:bg-accent-500/20 px-4 py-1.5 rounded-full hover:bg-accent-200 dark:hover:bg-accent-500/30 transition-colors uppercase tracking-widest shadow-sm"
                          title="Download Graph Image"
                        >
                          <Download className="w-3 h-3" /> Image
                        </button>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-white/10 bg-white">
                      <img 
                        src={`data:image/png;base64,${result.image_base64}`} 
                        alt="Peak Identifier Graph" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Microplastic Relevance Table */}
                  <div className="glass-card p-6 shadow-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <h3 className="text-sm font-black text-[var(--heading-color)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Table className="w-5 h-5 text-accent-600" />
                      Functional Groups & Microplastic Relevance
                    </h3>
                    
                    <div className="overflow-x-auto scrollbar-hide">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                            <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wavenumber (cm⁻¹)</th>
                            <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Functional Group</th>
                            <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Microplastic Relevance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {result.peaks.map((p, idx) => (
                            <motion.tr 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                            >
                              <td className="p-4">
                                <span className="font-black text-accent-700 dark:text-accent-400">{p.wavenumber}</span>
                              </td>
                              <td className="p-4">
                                <span className="text-xs font-bold px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full text-slate-800 dark:text-white">
                                  {p.functional_group}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                  {p.relevance}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {result.peaks.length === 0 && (
                        <p className="p-6 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
                          No significant functional groups detected.
                        </p>
                      )}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="glass-card h-[600px] flex flex-col items-center justify-center opacity-50 border-dashed border-2 border-slate-300 dark:border-white/10">
                  <LineChart className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Awaiting Data...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphPeakIdentifier;
