import React from 'react';
import { motion } from 'framer-motion';
import OverviewCards from '../components/OverviewCards';
import { LayoutDashboard, TrendingUp, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-slate-400 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl shadow-xl">
                <LayoutDashboard className="text-primary-800 dark:text-primary-500 w-7 h-7" />
              </div>
              <span className="text-gradient">Analytics Dashboard</span>
            </h1>
            <p className="text-sm text-[#1e293b] dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed">Real-time monitoring of microplastic detection and classification metrics from global analysis streams.</p>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
              <TrendingUp className="text-primary-800 dark:text-primary-500 w-4.5 h-4.5" />
              System Performance
            </h2>
            <div className="relative group/select">
              <select className="appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 pr-10 text-[9px] font-black text-slate-600 dark:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all cursor-pointer uppercase tracking-[0.2em] hover:bg-slate-50">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>All Time</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none transition-colors" />
            </div>
          </div>
          <OverviewCards />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
