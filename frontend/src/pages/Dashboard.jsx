import React from 'react';
import { motion } from 'framer-motion';
import OverviewCards from '../components/OverviewCards';
import { LayoutDashboard, TrendingUp, Users, ShieldCheck, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-slate-400 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white flex items-center gap-4">
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

        {/* Placeholder for deeper analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
          <div className="lg:col-span-2 glass-card p-8 h-80 flex items-center justify-center relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg bg-white dark:bg-white/5">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e905_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e905_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
             <div className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 rotate-6 shadow-md border border-slate-100 dark:border-white/5 group">
                   <TrendingUp className="w-8 h-8 text-primary-800 dark:text-primary-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="space-y-1">
                   <p className="text-slate-400 dark:text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">Growth Projections Analytics</p>
                   <p className="text-slate-600 dark:text-gray-500 text-xs font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-wider">Advanced data visualization module processing global contamination patterns with deep learning optimization.</p>
                </div>
             </div>
          </div>
          <div className="glass-card p-8 h-80 space-y-6 border-slate-200 dark:border-white/10 shadow-lg flex flex-col bg-white dark:bg-white/5">
             <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tighter uppercase">System Security</h3>
             <div className="space-y-3 flex-1">
                {[
                   { label: 'Network integrity', status: 'Secure', icon: ShieldCheck, color: 'text-emerald-700 dark:text-emerald-400' },
                   { label: 'Data encryption', status: 'Active', icon: ShieldCheck, color: 'text-emerald-700 dark:text-emerald-400' },
                   { label: 'Access control', status: 'Optimal', icon: ShieldCheck, color: 'text-emerald-700 dark:text-emerald-400' }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary-500/30 hover:-translate-x-1 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-xl shadow-inner">
                            <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                         </div>
                         <span className="text-sm font-black text-slate-800 dark:text-gray-300 tracking-tight">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 group-hover:text-emerald-700 transition-colors uppercase tracking-[0.2em]">{item.status}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
