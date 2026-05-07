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
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="text-primary-500 w-10 h-10" />
              <span className="text-gradient">Analysis Reports</span>
            </h1>
            <p className="text-gray-400 mt-2">Comprehensive documentation of detected microplastics and spectral analysis.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors">
              <Download className="w-4 h-4" /> Export All
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
              <Plus className="w-4 h-4" /> New Report
            </button>
          </div>
        </motion.div>

        {/* Search and Filters Bar */}
        <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search reports by sample ID, polymer type, or location..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 whitespace-nowrap px-2">
            <span>Sort by:</span>
            <button className="text-primary-400 flex items-center gap-1">Newest First</button>
          </div>
        </div>

        {/* Empty State */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] relative overflow-hidden"
        >
          <div className="bg-glow opacity-10 pointer-events-none" />
          
          <div className="relative">
             <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 rotate-12">
                <FileText className="w-10 h-10 text-gray-600 -rotate-12" />
             </div>
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500/20 rounded-full border border-primary-500/30 flex items-center justify-center"
             >
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
             </motion.div>
          </div>

          <div className="space-y-2 max-w-sm">
            <h2 className="text-2xl font-bold text-white">No reports generated yet</h2>
            <p className="text-gray-500 text-sm">Once you complete an FTIR analysis or computer vision scan, your detailed scientific reports will appear here.</p>
          </div>

          <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-semibold hover:bg-white/10 transition-all">
            Initiate New Analysis
          </button>
        </motion.div>

        {/* History/Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
              { label: 'Archived Reports', icon: Clock, count: 0 },
              { label: 'Shared with Team', icon: Plus, count: 0 },
              { label: 'Drafted Scans', icon: Search, count: 0 }
           ].map((item, i) => (
              <div key={i} className="glass-card p-6 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                       <item.icon className="w-5 h-5 text-gray-500 group-hover:text-primary-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                 </div>
                 <span className="text-xs font-bold text-gray-600">{item.count}</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
