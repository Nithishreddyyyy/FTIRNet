import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Clock, Plus, Filter, Download } from 'lucide-react';

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
              className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-14 pr-6 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400 shadow-sm"
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
          className="glass-card p-16 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none" />
          
          <div className="relative">
             <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center border border-slate-200 dark:border-white/10 rotate-6 shadow-md relative z-10 group">
                <FileText className="w-10 h-10 text-slate-300 dark:text-gray-600 -rotate-6 transition-transform group-hover:scale-110 duration-700" />
             </div>
          </div>

          <div className="space-y-4 max-w-sm relative z-10">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight uppercase">No reports <br />generated yet</h2>
            <p className="text-slate-600 dark:text-gray-400 text-xs font-bold leading-relaxed">Once you complete an analysis, your detailed scientific reports will appear here.</p>
          </div>

          <button className="relative z-10 px-14 py-5 bg-white dark:bg-white/5 border-2 border-primary-500/30 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white text-[11px] font-black shadow-2xl hover:shadow-[0_20px_40px_rgba(3,105,161,0.3)] hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1.5 active:translate-y-0 uppercase tracking-[0.25em]">
            Initiate New Analysis
          </button>
        </motion.div>

        {/* History/Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16">
           {[
              { label: 'Archived Reports', icon: Clock, count: 0 },
              { label: 'Shared with Team', icon: Plus, count: 0 },
              { label: 'Drafted Scans', icon: Search, count: 0 }
           ].map((item, i) => (
              <div key={i} className="glass-card p-10 flex items-center justify-between bg-white dark:bg-white/5 hover:shadow-2xl hover:border-primary-500/50 hover:-translate-y-2 transition-all group cursor-pointer border-primary-500/30 dark:border-white/10 shadow-2xl">
                 <div className="flex items-center gap-8">
                    <div className="p-5 bg-primary-700/10 dark:bg-white/5 rounded-2xl group-hover:bg-primary-700/20 transition-all shadow-inner border border-primary-500/10">
                       <item.icon className="w-8 h-8 text-primary-800 dark:text-gray-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-base font-black text-gray-900 dark:text-gray-300 group-hover:text-primary-800 dark:group-hover:text-primary-400 transition-colors uppercase tracking-[0.2em]">{item.label}</span>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center border-2 border-primary-500/30 dark:border-white/10 shadow-xl">
                    <span className="text-xs font-black text-gray-600 dark:text-gray-600">{item.count}</span>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
