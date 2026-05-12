import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Clock, Plus, Filter, Download, Database, Eye, Trash2 } from 'lucide-react';

const mockReports = [
  { id: 'FTIR-001', name: 'Marine Sediments Sample A', polymer: 'Polyethylene (PE)', confidence: 98.4, date: '2026-05-10', status: 'Completed' },
  { id: 'FTIR-002', name: 'River Surface Water B', polymer: 'Polypropylene (PP)', confidence: 92.1, date: '2026-05-09', status: 'Completed' },
  { id: 'FTIR-003', name: 'Deep Ocean Core C', polymer: 'Polystyrene (PS)', confidence: 88.5, date: '2026-05-08', status: 'Processing' },
  { id: 'FTIR-004', name: 'Coastal Beach Sand D', polymer: 'PET', confidence: 96.2, date: '2026-05-07', status: 'Completed' },
  { id: 'FTIR-005', name: 'Urban Runoff Sample E', polymer: 'PVC', confidence: 84.7, date: '2026-05-06', status: 'Completed' },
];

const Reports = () => {
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
            <p className="text-sm text-slate-700 dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed">Comprehensive documentation of detected microplastics and spectral analysis from your global dataset.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-3 px-8 py-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl text-xs font-black text-slate-800 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl uppercase tracking-[0.2em] hover:-translate-y-1 active:translate-y-0">
              <Filter className="w-5 h-5 text-primary-800" /> FILTER
            </button>
            <button className="flex items-center gap-3 px-8 py-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl text-xs font-black text-slate-800 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-xl uppercase tracking-[0.2em] hover:-translate-y-1 active:translate-y-0">
              <Download className="w-5 h-5 text-primary-800" /> EXPORT ALL
            </button>
            <button className="flex items-center gap-3 px-10 py-3.5 bg-black hover:bg-slate-900 text-white text-xs font-black rounded-2xl shadow-2xl transition-all hover:-translate-y-1.5 active:translate-y-0 uppercase tracking-[0.2em]">
              <Plus className="w-6 h-6" /> New Report
            </button>
          </div>
        </motion.div>

        {/* Search and Filters Bar */}
        <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports by sample ID, polymer type, or location..." 
              className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-14 pr-6 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap px-6 border-l-2 border-slate-100 dark:border-white/10 h-10">
            <span>Sort by:</span>
            <button className="text-primary-800 dark:text-primary-400 flex items-center gap-2 hover:translate-x-1 transition-transform group">
              Newest First <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Empty State */}
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
            <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tighter leading-tight uppercase">No reports <br />generated yet</h2>
            <p className="text-slate-600 dark:text-gray-400 text-xs font-medium leading-relaxed">Once you complete an analysis, your detailed scientific reports will appear here.</p>
          </div>

          <button className="relative z-10 px-14 py-5 bg-white dark:bg-white/5 border-2 border-primary-500/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-[11px] font-black shadow-2xl hover:shadow-[0_20px_40px_rgba(3,105,161,0.3)] hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1.5 active:translate-y-0 uppercase tracking-[0.25em]">
            Initiate New Analysis
          </button>
        </motion.div>

        {/* Generated Reports Library */}
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
            <h2 className="text-2xl font-bold text-[var(--heading-color)] tracking-tighter">Generated Reports Library</h2>
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
                  {mockReports.map((report, i) => (
                    <tr key={i} className="hover:bg-primary-500/5 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-primary-500/10 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-primary-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{report.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">ID: {report.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-600/10 dark:bg-primary-500/10 text-primary-800 dark:text-primary-400 border border-primary-500/20 dark:border-primary-500/30 whitespace-nowrap">
                          {report.polymer}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{report.confidence}%</span>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{report.date}</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                          report.status === 'Completed' 
                          ? 'bg-emerald-600/10 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
                          : 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-primary-600 dark:text-primary-400 transition-colors shadow-sm border border-transparent hover:border-primary-500/20 dark:hover:border-white/10" title="View Report">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-gray-600 dark:text-gray-400 transition-colors shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10" title="Download PDF">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 transition-colors shadow-sm border border-transparent hover:border-red-500/20 dark:hover:border-red-500/30" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
