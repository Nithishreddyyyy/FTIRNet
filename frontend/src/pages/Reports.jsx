import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Clock, Plus, Filter, Download, Database, Eye, Trash2, ImageIcon } from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const {
    reports,
    loading,
    error,
    pagination,
    setPagination,
    fetchReports,
    deleteReport,
    searchReports,
    filterReports,
  } = useReports();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('all');
  const [filterPolymer, setFilterPolymer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reportType, setReportType] = useState('All');

  useEffect(() => {
    fetchReports(pagination.limit, pagination.offset);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (searchQuery.length >= 2) {
      const results = await searchReports(searchQuery, searchBy);
      if (results && results.length > 0) {
        // Use local state for search results
      }
    }
  };

  const handleApplyFilter = () => {
    const filters = {};
    if (filterPolymer) filters.polymer = filterPolymer;
    if (filterStatus) filters.status = filterStatus;
    filterReports(filters);
  };

  const handleClearFilters = () => {
    setFilterPolymer('');
    setFilterStatus('');
    fetchReports(pagination.limit, 0);
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await deleteReport(reportId);
    }
  };

  const handleDownload = async (report) => {
    try {
      const response = await api.get(
        `/reports/${report.id}/download`,
        { responseType: 'blob' }
      );

      const filename = `report_${report.sample_id || report.id || 'unknown'}.pdf`;
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF report:', err);
      alert('Unable to download PDF report. Please try again later.');
    }
  };

  const filteredDisplayReports = reports.filter(r => {
    if (reportType === 'All') return true;
    if (reportType === 'Peak Identification') return r.model_used === 'Peak Identifier';
    return r.model_used !== 'Peak Identifier'; // For FTIR Analysis
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-slate-300 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl shadow-xl">
                <FileText className="text-primary-800 dark:text-primary-500 w-7 h-7" />
              </div>
              <span className="text-gradient">Analysis Reports</span>
            </h1>
            <p className="text-sm text-slate-700 dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed">
              Comprehensive documentation of detected microplastics and spectral analysis from your global dataset.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-3 px-8 py-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl text-xs font-black text-slate-800 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl uppercase tracking-[0.2em] hover:-translate-y-1 active:translate-y-0"
            >
              <Filter className="w-5 h-5 text-primary-800" /> CLEAR FILTERS
            </button>
            <button
              onClick={() => fetchReports(pagination.limit, 0)}
              className="flex items-center gap-3 px-8 py-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl text-xs font-black text-slate-800 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl uppercase tracking-[0.2em] hover:-translate-y-1 active:translate-y-0"
            >
              <Download className="w-5 h-5 text-primary-800" /> REFRESH
            </button>
          </div>
        </motion.div>

        {/* Report Type Tabs */}
        <div className="flex items-center justify-center gap-4">
          {['All', 'FTIR Analysis', 'Peak Identification'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all shadow-md border ${
                reportType === type
                  ? 'bg-primary-700 text-white border-primary-600 shadow-xl scale-105'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-800 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search reports by sample ID, polymer type, or location..."
              className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-14 pr-6 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterPolymer}
              onChange={(e) => setFilterPolymer(e.target.value)}
              className="appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-slate-600 dark:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/20 uppercase tracking-[0.2em]"
            >
              <option value="">All Polymers</option>
              <option value="HDPE">HDPE</option>
              <option value="LDPE">LDPE</option>
              <option value="PET">PET</option>
              <option value="PP">PP</option>
              <option value="PS">PS</option>
              <option value="PVC">PVC</option>
              <option value="PLA">PLA</option>
            </select>
            <button
              onClick={handleApplyFilter}
              className="text-[10px] font-black px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-all uppercase tracking-[0.2em]"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 font-black uppercase tracking-wider">
                Loading reports...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-red-600 font-black">Error: {error}</p>
            <button
              onClick={() => fetchReports(pagination.limit, 0)}
              className="mt-4 px-6 py-3 bg-primary-700 text-white rounded-xl font-black uppercase tracking-wider hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && reports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px] relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 dark:from-white/5 to-transparent pointer-events-none" />

            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center border border-slate-200 dark:border-white/10 rotate-6 shadow-md relative z-10 group">
                <FileText className="w-10 h-10 text-slate-300 dark:text-gray-600 -rotate-6 transition-transform group-hover:scale-110 duration-700" />
              </div>
            </div>

            <div className="space-y-4 max-w-sm relative z-10">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tighter leading-tight uppercase">
                No reports yet
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-xs font-medium leading-relaxed">
                Once you complete an analysis, your detailed scientific reports will appear here.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = '/ftir-analysis')}
              className="relative z-10 px-14 py-5 bg-white dark:bg-white/5 border-2 border-primary-500/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-[11px] font-black shadow-2xl hover:shadow-[0_20px_40px_rgba(3,105,161,0.3)] hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1.5 active:translate-y-0 uppercase tracking-[0.25em]"
            >
              Start New Analysis
            </button>
          </motion.div>
        )}

        {/* Generated Reports Library */}
        {!loading && !error && reports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 pb-16"
          >
            <div className="flex items-center gap-4 px-2">
              <div className="p-3 bg-primary-700/10 dark:bg-white/5 rounded-2xl border border-primary-500/20 dark:border-white/10 shadow-sm">
                <Database className="w-6 h-6 text-primary-800 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--heading-color)] tracking-tighter">
                Generated Reports Library ({pagination.total})
              </h2>
            </div>

            <div className="glass-card overflow-hidden border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5 rounded-[2rem]">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-primary-500/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Report Name</th>
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Polymer Type</th>
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</th>
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-500/5 dark:divide-white/5">
                    {filteredDisplayReports.map((report, i) => {
                      const pred = report.predictions || {};
                      const polymer =
                        typeof pred === 'object' && pred !== null
                          ? pred.class || pred.predicted_polymer || 'Unknown'
                          : 'Unknown';
                      
                      const rawConf = typeof pred === 'object' && pred !== null ? (pred.confidence || 0) : 0;
                      const conf = rawConf <= 1 ? Math.round(rawConf * 10000) / 100 : Math.round(rawConf * 100) / 100;
                      
                      const isPeak = report.model_used === 'Peak Identifier';

                      return (
                        <tr
                          key={i}
                          className="hover:bg-primary-500/5 dark:hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-primary-500/10 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5 text-primary-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-200">
                                  {report.title || 'Untitled Report'}
                                </p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                  ID: {report.id || report.sample_id || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-600/10 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400 border border-primary-500/20 dark:border-primary-500/30 whitespace-nowrap">
                              {polymer}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                              {isPeak ? 'N/A' : `${conf}%`}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                              {report.created_at
                                ? new Date(report.created_at).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </td>
                          <td className="p-6">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                                report.status === 'Completed'
                                  ? 'bg-emerald-600/10 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
                                  : 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30'
                              }`}
                            >
                              {report.status || 'N/A'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDownload(report)}
                                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-primary-600 dark:text-primary-400 transition-colors shadow-sm border border-transparent hover:border-primary-500/20 dark:hover:border-white/10"
                                title="Download Report"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {isPeak && typeof pred === 'object' && pred.image_base64 && (
                                <button
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = `data:image/png;base64,${pred.image_base64}`;
                                    a.download = `Graph_${report.sample_id || report.id || 'Peak'}.png`;
                                    a.click();
                                  }}
                                  className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-accent-600 dark:text-accent-400 transition-colors shadow-sm border border-transparent hover:border-accent-500/20 dark:hover:border-white/10"
                                  title="Download Graph Image"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(report.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 transition-colors shadow-sm border border-transparent hover:border-red-500/20 dark:hover:border-red-500/30"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-primary-500/5 dark:border-white/5">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
                  Showing {filteredDisplayReports.length} reports
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: Math.max(0, prev.offset - prev.limit),
                      }))
                    }
                    disabled={pagination.offset === 0}
                    className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-700 dark:text-gray-300 hover:bg-slate-50 disabled:opacity-40 transition-all uppercase tracking-[0.2em]"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: prev.offset + prev.limit,
                      }))
                    }
                    disabled={!pagination.has_more}
                    className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-700 dark:text-gray-300 hover:bg-slate-50 disabled:opacity-40 transition-all uppercase tracking-[0.2em]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;