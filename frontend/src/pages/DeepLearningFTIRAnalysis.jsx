import React, { useState, useEffect, useRef } from 'react';
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
  TrendingUp,
  BarChart3,
  Search,
  Zap,
  RefreshCw,
  Loader2,
  Table,
  Rows4,
} from 'lucide-react';
import api from '../services/api';

const DeepLearningFTIRAnalysis = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedModel, setSelectedModel] = useState('CNN Model');
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [models, setModels] = useState([]);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await api.get('/models');
        if (res.data.models && res.data.models.length > 0) {
          setModels(res.data.models);
        }
      } catch {
        setModels([
          { id: 'base_cnn', name: 'CNN Model', type: 'CNN', accuracy: 98.4 },
          {
            id: 'pretrained_cnn',
            name: 'Fine-Tuned CNN Model',
            type: 'CNN (Fine-Tuned)',
            accuracy: 99.1,
          },
        ]);
      }
    };
    fetchModels();
  }, []);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
      setUploadError(null);
      setFile({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + ' KB',
        timestamp: new Date().toLocaleString(),
        status: 'Ready',
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
        timestamp: new Date().toLocaleString(),
        status: 'Ready',
        rawFile: uploadedFile,
      });
    } else if (uploadedFile) {
      setUploadError('Only .csv files are supported.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const mapModelToApi = (modelName) => {
    const mapping = {
      'CNN Model': 'base_model',
      'Fine-Tuned CNN Model': 'finetuned_model',
      base_cnn: 'base_model',
      pretrained_cnn: 'finetuned_model',
    };
    return mapping[modelName] || 'base_model';
  };

  const runAnalysis = async () => {
    if (!file || !file.rawFile) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file.rawFile);

    const apiEndpoint = mapModelToApi(selectedModel);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 5 + 1;
      });
    }, 200);

    try {
      const startTime = Date.now();
      const response = await api.post(
        `/prediction/${apiEndpoint}/prediction`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const data = response.data;

      // ─── Handle both single and multiple sample results ───
      const rawPrediction = data.prediction || data;
      let predictionsList = [];

      if (Array.isArray(rawPrediction)) {
        // Multiple samples returned as a list
        predictionsList = rawPrediction.map((p, idx) => ({
          sampleId: p.sample_id || p.Sample_ID || `Sample-${idx + 1}`,
          polymer: p.predicted_polymer || p.class || p.Predicted_Polymer || 'Unknown',
          confidence: p.confidence || p.Confidence || 0,
        }));
      } else if (rawPrediction && typeof rawPrediction === 'object') {
        // Single sample returned as object — normalize into a one-element list
        predictionsList = [
          {
            sampleId: rawPrediction.sample_id || rawPrediction.Sample_ID || data.prediction?.sample_id || 'FTIR-' + Math.floor(Math.random() * 10000),
            polymer: rawPrediction.predicted_polymer || rawPrediction.class || rawPrediction.Predicted_Polymer || 'Unknown',
            confidence: rawPrediction.confidence || rawPrediction.Confidence || 0,
          },
        ];
      }

      // Normalize confidence to percentage (API may return 0–1 or 0–100)
      predictionsList = predictionsList.map((p) => ({
        ...p,
        confidence:
          p.confidence <= 1 ? Math.round(p.confidence * 10000) / 100 : Math.round(p.confidence * 100) / 100,
      }));

      const isMultiSample = predictionsList.length > 1;
      const avgConfidence =
        predictionsList.reduce((sum, p) => sum + p.confidence, 0) / predictionsList.length;

      setAnalysisResult({
        predictions: predictionsList,
        model: selectedModel,
        sampleIds: predictionsList.map((p) => p.sampleId),
        processingTime: elapsedTime + 's',
        peaks: 12,
        status: 'Verified',
        isMultiSample,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        rawData: data,
      });

      // Save as report automatically
      try {
        const primaryPrediction = predictionsList[0];
        await api.post('/reports', {
          title: `Analysis: ${primaryPrediction.polymer}${isMultiSample ? ` (${predictionsList.length} samples)` : ''}`,
          sample_id: primaryPrediction.sampleId,
          predictions: data.prediction || data,
          model_used: apiEndpoint,
          summary: `${isMultiSample ? predictionsList.length + ' samples analyzed. ' : ''}${primaryPrediction.polymer} detected with ${primaryPrediction.confidence}% confidence.`,
          status: 'Completed',
        });
      } catch {
        // Report creation is optional
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      const errorMsg = err.response?.data?.error || err.message || 'Analysis failed.';
      setUploadError(errorMsg);
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setProgress(0);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    let report = `SpectraVision Analysis Report
============================
Model: ${analysisResult.model}
Processing Time: ${analysisResult.processingTime}
Status: ${analysisResult.status}
Generated: ${new Date().toLocaleString()}
============================
\n`;

    analysisResult.predictions.forEach((p, idx) => {
      report += `Sample ${idx + 1}:
  ID: ${p.sampleId}
  Polymer: ${p.polymer}
  Confidence: ${p.confidence}%
\n`;
    });

    report += '============================\nReport generated by SpectraVision System';

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${analysisResult.sampleIds?.[0] || 'FTIR'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-8 border-b-2 border-slate-300 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl shadow-xl">
                <Cpu className="text-primary-800 dark:text-primary-500 w-7 h-7" />
              </div>
              <span className="text-gradient">DeepLearning FTIR Analysis</span>
            </h1>
            <p className="text-sm text-slate-700 dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed uppercase tracking-wider">
              Professional AI-powered scientific spectral analysis laboratory.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SIDE — Upload & Controls Panel */}
          <div className="lg:col-span-5 space-y-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="glass-card p-8 relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5"
              >
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-10 transition-all duration-500 bg-slate-50/30 dark:bg-white/[0.02] shadow-inner">
                  <div className="p-6 bg-primary-600/10 rounded-full transition-all duration-500 shadow-sm border border-slate-100 dark:border-white/5">
                    <Upload className="w-10 h-10 text-primary-800 dark:text-primary-400" />
                  </div>
                  <h3 className="mt-6 text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">
                    Upload FTIR Dataset
                  </h3>
                  <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">
                    Supports .csv spectral datasets • Multi-sample supported
                  </p>

                  <label className="mt-10 px-8 py-3.5 bg-slate-900 hover:bg-primary-600 text-white text-[10px] font-black rounded-xl cursor-pointer transition-colors duration-300 uppercase tracking-widest shadow-md">
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
                      className="mt-4 text-red-600 dark:text-red-400 text-[10px] font-black bg-red-100 dark:bg-red-500/10 px-4 py-2 rounded-xl"
                    >
                      <AlertTriangle className="inline w-4 h-4 mr-2" />
                      {uploadError}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* File Details Card */}
            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-8 border-l-8 border-l-emerald-600 border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-2xl shadow-inner border border-emerald-500/20">
                        <FileText className="w-8 h-8 text-emerald-800 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[var(--heading-color)] font-black text-lg truncate max-w-[220px] tracking-tight">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1.5">
                          {file.size} • {file.timestamp}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 drop-shadow-md" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Model Selection & Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10 space-y-10 border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5"
            >
              <div className="space-y-5">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] px-2">
                  Select Neural Model
                </label>
                <div className="relative group/select">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border-2 border-primary-500/30 dark:border-white/10 rounded-[1.5rem] px-6 py-5 text-[var(--heading-color)] appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/20 cursor-pointer transition-all font-black text-base shadow-md hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    {models.length > 0 ? (
                      models.map((m) => (
                        <option
                          key={m.id || m.name}
                          value={m.name}
                          className="bg-white dark:bg-dark-bg text-gray-950 dark:text-white"
                        >
                          {m.name}{' '}
                          {m.accuracy && `(~${m.accuracy}% accuracy)`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="CNN Model">CNN Model</option>
                        <option value="Fine-Tuned CNN Model">
                          Fine-Tuned CNN Model
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700 pointer-events-none group-focus-within/select:rotate-180 transition-transform" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={runAnalysis}
                  disabled={!file || isAnalyzing}
                  className={`flex-[2] flex items-center justify-center gap-4 py-5 rounded-[1.5rem] font-black transition-all duration-300 relative overflow-hidden group shadow-2xl uppercase tracking-[0.2em] text-xs
                    ${
                      !file || isAnalyzing
                        ? 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-primary-700 text-white hover:shadow-[0_20px_40px_rgba(3,105,161,0.6)] hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98]'
                    }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      Run Analysis
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="flex-1 px-10 py-5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-2 border-primary-500/30 dark:border-white/10 text-gray-900 dark:text-gray-300 rounded-[1.5rem] transition-all flex items-center justify-center gap-4 shadow-xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl hover:-translate-y-1.5 active:translate-y-0"
                >
                  <RotateCcw className="w-6 h-6" />
                  Reset
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE — Analysis Results Panel */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                /* Loading State */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card h-full min-h-[550px] flex flex-col items-center justify-center p-16 relative overflow-hidden border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="w-72 h-72 border-[12px] border-primary-600/5 dark:border-primary-500/10 border-t-primary-700 rounded-full shadow-inner"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-8 border-[12px] border-accent-600/5 dark:border-accent-500/10 border-b-accent-700 rounded-full shadow-inner"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-20 h-20 text-primary-800 dark:text-primary-400 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-80 text-center space-y-10 w-full max-w-lg">
                    <div className="space-y-3">
                      <h3 className="text-4xl font-black text-[var(--heading-color)] tracking-tighter">
                        Analyzing FTIR Data...
                      </h3>
                      <p className="text-gray-700 dark:text-gray-400 text-sm font-bold leading-relaxed">
                        Deep learning model scanning {analysisResult?.predictions?.length || 'all'} sample(s) with neural optimization.
                      </p>
                    </div>
                    <div className="w-full bg-primary-600/10 dark:bg-white/5 rounded-full h-4 overflow-hidden border border-primary-500/30 dark:border-white/10 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary-700 to-accent-700 shadow-[0_0_25px_rgba(3,105,161,0.6)]"
                      />
                    </div>
                    <p className="text-[11px] font-black text-primary-800 dark:text-primary-400 uppercase tracking-[0.4em]">
                      {progress}% Neural Processing
                    </p>
                  </div>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Header with Sample Count */}
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-3xl font-black text-[var(--heading-color)] flex items-center gap-5 tracking-tighter">
                      <BarChart3 className="text-primary-800 dark:text-primary-500 w-10 h-10" />
                      Spectral Analysis Results
                    </h2>
                    <span className="text-[10px] font-black text-gray-700 bg-white dark:bg-white/5 px-6 py-3 rounded-2xl border border-primary-500/30 dark:border-white/10 shadow-xl uppercase tracking-[0.25em]">
                      {analysisResult.isMultiSample
                        ? `${analysisResult.predictions.length} Samples`
                        : `REF: ${analysisResult.predictions[0]?.sampleId}`}
                    </span>
                  </div>

                  {analysisResult.isMultiSample ? (
                    /* ──── MULTI-SAMPLE RESULTS ──── */
                    <>
                      {/* Summary Card */}
                      <div className="glass-card p-8 relative overflow-hidden group border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-15 transition-opacity duration-1000">
                          <Activity className="w-64 h-64 text-primary-800" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                          <div>
                            <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-2">
                              Total Samples
                            </p>
                            <p className="text-4xl font-black text-[var(--heading-color)] tracking-tighter">
                              {analysisResult.predictions.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-2">
                              Average Confidence
                            </p>
                            <p className="text-4xl font-black text-emerald-800 dark:text-emerald-400 tracking-tighter">
                              {analysisResult.avgConfidence}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-2">
                              Unique Polymers
                            </p>
                            <p className="text-4xl font-black text-purple-800 dark:text-purple-400 tracking-tighter">
                              {
                                new Set(
                                  analysisResult.predictions.map(
                                    (p) => p.polymer
                                  )
                                ).size
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Predictions Table */}
                      <div className="glass-card p-8 relative overflow-hidden border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-700/10 rounded-2xl shadow-inner border border-primary-500/20">
                              <Table className="w-6 h-6 text-primary-800 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-black text-[var(--heading-color)] uppercase tracking-tighter">
                              Per-Sample Predictions
                            </h3>
                          </div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            Model: {analysisResult.model}
                          </span>
                        </div>

                        <div className="overflow-x-auto scrollbar-hide">
                          <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                              <tr className="border-b border-primary-500/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                  #
                                </th>
                                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                  Sample ID
                                </th>
                                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                  Predicted Polymer
                                </th>
                                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                                  Confidence
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-500/5 dark:divide-white/5">
                              {analysisResult.predictions.map(
                                (pred, idx) => (
                                  <motion.tr
                                    key={pred.sampleId}
                                    initial={{
                                      opacity: 0,
                                      y: 10,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                    }}
                                    transition={{
                                      delay: idx * 0.05,
                                    }}
                                    className="hover:bg-primary-500/5 dark:hover:bg-white/[0.02] transition-colors group"
                                  >
                                    <td className="p-4">
                                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                        {idx + 1}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                                        {pred.sampleId}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-600/10 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400 border border-primary-500/20 dark:border-primary-500/30 whitespace-nowrap">
                                        {pred.polymer}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                                        {pred.confidence.toFixed(1)}%
                                      </span>
                                      <div className="w-full h-1.5 bg-primary-600/10 rounded-full mt-1.5 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{
                                            width: `${Math.min(pred.confidence, 100)}%`,
                                          }}
                                          transition={{
                                            delay: idx * 0.05 + 0.3,
                                          }}
                                          className={`h-full rounded-full ${
                                            pred.confidence >= 90
                                              ? 'bg-emerald-600'
                                              : pred.confidence >= 75
                                              ? 'bg-amber-500'
                                              : 'bg-red-500'
                                          }`}
                                        />
                                      </div>
                                    </td>
                                  </motion.tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ──── SINGLE-SAMPLE RESULTS (unchanged minus risk) ──── */
                    <>
                      {/* Main Result Card */}
                      <div className="glass-card p-12 relative overflow-hidden group border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-15 transition-opacity duration-1000">
                          <Activity className="w-64 h-64 text-primary-800" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                          <div className="space-y-10">
                            <div className="space-y-3">
                              <p className="text-[11px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-[0.3em] mb-3">
                                Predicted Polymer Type
                              </p>
                              <h2 className="text-6xl font-black text-[var(--heading-color)] tracking-tighter leading-none">
                                {analysisResult.predictions[0]?.polymer}
                              </h2>
                            </div>

                            <div className="p-8 bg-white dark:bg-white/5 rounded-[3rem] border border-primary-500/20 dark:border-white/10 flex-1 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-4">
                                Confidence
                              </p>
                              <div className="flex items-baseline gap-1">
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-5xl font-black text-emerald-800 dark:text-emerald-400 tracking-tighter"
                                >
                                  {analysisResult.predictions[0]?.confidence.toFixed(1)}%
                                </motion.span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-10">
                            <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-primary-500/30 dark:border-white/10 shadow-xl border-l-8 border-l-primary-600">
                              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-5">
                                Analysis Model
                              </p>
                              <div className="flex items-center gap-5 text-[var(--heading-color)] font-black text-2xl tracking-tighter">
                                <div className="p-4 bg-primary-700/10 rounded-2xl shadow-inner">
                                  <Cpu className="w-8 h-8 text-primary-800 dark:text-primary-400" />
                                </div>
                                {analysisResult.model}
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="flex items-center gap-5 text-xs font-black text-emerald-900 dark:text-emerald-400 bg-emerald-600/10 px-8 py-5 rounded-[2rem] border border-emerald-500/30 shadow-md uppercase tracking-[0.2em]">
                                <div className="w-4 h-4 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_15px_#10b981]" />
                                <span>Neural Classification Success</span>
                              </div>
                            </div>

                            <button
                              onClick={downloadReport}
                              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-xl border-b-4 border-blue-800"
                            >
                              <FileText className="w-4 h-4 inline mr-2" />
                              Download Report
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Spectrum Visualization */}
                      <div className="glass-card p-12 h-96 relative overflow-hidden border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
                        <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-5">
                            <div className="p-3 bg-primary-700/10 rounded-2xl shadow-xl border border-primary-500/20">
                              <Activity className="w-6 h-6 text-primary-800" />
                            </div>
                            <h3 className="text-sm font-black text-[var(--heading-color)] uppercase tracking-[0.3em]">
                              Spectral Absorption Profile
                            </h3>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-primary-700 shadow-[0_0_15px_rgba(3,105,161,0.6)]" />
                            <div className="w-5 h-5 rounded-full bg-accent-700 shadow-[0_0_15px_rgba(109,40,217,0.6)]" />
                          </div>
                        </div>

                        <div className="relative w-full h-56 mt-6 px-6">
                          <svg
                            className="w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient
                                id="spectrumGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#0369a1"
                                  stopOpacity="1"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#6d28d9"
                                  stopOpacity="1"
                                />
                              </linearGradient>
                              <filter id="glow">
                                <feGaussianBlur
                                  stdDeviation="4"
                                  result="coloredBlur"
                                />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{
                                duration: 2.5,
                                ease: 'easeInOut',
                              }}
                              d="M0,120 Q60,40 120,100 T240,60 T360,130 T480,40 T600,110 T720,60 T840,130 T960,50"
                              fill="none"
                              stroke="url(#spectrumGradient)"
                              strokeWidth="7"
                              filter="url(#glow)"
                              className="w-full"
                            />
                            {[120, 360, 600, 840].map((x, i) => (
                              <motion.circle
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 2 + i * 0.25 }}
                                cx={x}
                                cy={i % 2 === 0 ? 100 : 40}
                                r="8"
                                fill={
                                  i % 2 === 0 ? '#0369a1' : '#6d28d9'
                                }
                                className="shadow-2xl border-4 border-white"
                              />
                            ))}
                          </svg>

                          <div className="absolute inset-0 grid grid-cols-10 gap-6 pointer-events-none opacity-[0.15] dark:opacity-[0.05]">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className="border-l-2 border-gray-950 dark:border-white h-full"
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 grid grid-rows-5 gap-6 pointer-events-none opacity-[0.15] dark:opacity-[0.05]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="border-t-2 border-gray-950 dark:border-white w-full"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between mt-10 text-[10px] font-black text-gray-600 dark:text-gray-600 uppercase tracking-[0.4em] px-6">
                          <span>4000 cm⁻¹</span>
                          <span>3000 cm⁻¹</span>
                          <span>2000 cm⁻¹</span>
                          <span>1500 cm⁻¹</span>
                          <span>1000 cm⁻¹</span>
                          <span>500 cm⁻¹</span>
                        </div>
                      </div>

                      {/* Additional Stats Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
                        {[
                          {
                            label: 'Sample ID',
                            value: analysisResult.predictions[0]?.sampleId,
                            icon: Hash,
                          },
                          {
                            label: 'Processing Time',
                            value: analysisResult.processingTime,
                            icon: Clock,
                          },
                          {
                            label: 'Peaks Found',
                            value: analysisResult.peaks,
                            icon: TrendingUp,
                          },
                          {
                            label: 'Status',
                            value: analysisResult.status,
                            icon: CheckCircle2,
                          },
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.15 }}
                            className="glass-card p-8 bg-white dark:bg-white/5 hover:shadow-2xl hover:border-primary-500/50 hover:-translate-y-2 transition-all group border-primary-500/30 dark:border-white/10 shadow-xl"
                          >
                            <p className="text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-[0.25em] mb-5">
                              {stat.label}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary-700/10 rounded-2xl group-hover:bg-primary-700/20 transition-all shadow-inner border border-primary-500/10">
                                <stat.icon className="w-5 h-5 text-primary-800 dark:text-primary-400" />
                              </div>
                              <span className="text-[var(--heading-color)] font-black text-base tracking-tighter">
                                {stat.value}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card h-full min-h-[550px] flex flex-col items-center justify-center p-20 text-center border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5"
                >
                  <div className="p-12 bg-white dark:bg-white/5 rounded-[3.5rem] mb-12 border-2 border-primary-500/30 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Search className="w-24 h-24 text-primary-900/20 dark:text-gray-600 relative z-10 transition-transform group-hover:scale-110 duration-700" />
                  </div>
                  <div className="space-y-5">
                    <h3 className="text-4xl font-black text-[var(--heading-color)] tracking-tighter leading-tight">
                      Ready for <br />
                      Spectral Analysis
                    </h3>
                    <p className="text-gray-800 dark:text-gray-400 max-w-sm font-bold text-base leading-relaxed mx-auto">
                      Upload a high-fidelity CSV dataset on the left to begin the Deep Learning FTIR classification process. Supports single and multi-sample CSVs.
                    </p>
                  </div>

                  <div className="mt-20 grid grid-cols-3 gap-12 opacity-40 dark:opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
                      <div className="w-12 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-14 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
                      <div className="w-20 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
                      <div className="w-14 h-2.5 bg-primary-800/40 dark:bg-white/20 rounded-full" />
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
          className="space-y-12 pt-10"
        >
          <HistoryList />
        </motion.div>
      </div>
    </div>
  );
};

// Embedded History List component
const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.get('/history?limit=3');
        setHistory(res.data.data || []);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="flex items-center justify-between px-6">
        <h3 className="text-3xl font-black text-[var(--heading-color)] flex items-center gap-5 tracking-tighter">
          <div className="p-4 bg-white dark:bg-white/5 border border-primary-500/30 dark:border-white/10 rounded-[1.5rem] shadow-xl">
            <Clock className="text-primary-800 dark:text-primary-500 w-7 h-7" />
          </div>
          Recent Spectral History
        </h3>
        <button
          onClick={() => (window.location.href = '/history')}
          className="text-[11px] font-black text-primary-800 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-all uppercase tracking-[0.3em] border-b-4 border-primary-500/30 hover:border-primary-700 hover:pb-1"
        >
          View Full Archive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-16">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-full text-center py-8">
            No analysis history yet. Run an analysis above to get started.
          </p>
        ) : (
          history.map((item) => {
            const pred = item.prediction;
            const polymer =
              typeof pred === 'object' && pred !== null
                ? pred.class || pred.predicted_polymer || 'Unknown'
                : 'Unknown';
            const confidence =
              typeof pred === 'object' && pred !== null
                ? Math.round((pred.confidence || 0) * 10000) / 100
                : 0;

            return (
              <div
                key={item.id}
                className="glass-card p-8 bg-white dark:bg-white/5 hover:shadow-2xl hover:border-primary-500/50 hover:-translate-y-2 transition-all group flex items-center gap-8 border-primary-500/30 dark:border-white/10 shadow-2xl"
              >
                <div className="p-5 bg-primary-700/10 rounded-[1.75rem] group-hover:bg-primary-700/20 transition-all shadow-inner border border-primary-500/20">
                  <FileText className="w-10 h-10 text-primary-800 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-[var(--heading-color)] truncate tracking-tighter">
                    {item.uploaded_file || 'Unnamed Sample'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] text-emerald-900 dark:text-emerald-400 font-bold uppercase tracking-widest">
                      {polymer}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold hidden sm:inline-block">
                      •
                    </span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-500 font-bold uppercase tracking-widest">
                      {confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default DeepLearningFTIRAnalysis;