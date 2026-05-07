import React from 'react';
import { motion } from 'framer-motion';
import OverviewCards from '../components/OverviewCards';
import { LayoutDashboard, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <LayoutDashboard className="text-primary-500 w-10 h-10" />
              <span className="text-gradient">Analytics Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-2">Real-time monitoring of microplastic detection and classification metrics.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-bg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-dark-bg bg-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400">
                +12
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Active Research Team</p>
              <p className="text-sm text-white font-bold tracking-tight">Vanguard Division</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-primary-500 w-5 h-5" />
              System Performance
            </h2>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none focus:ring-1 focus:ring-primary-500/50">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <OverviewCards />
        </div>

        {/* Placeholder for deeper analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          <div className="lg:col-span-2 glass-card p-8 h-80 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
             <div className="text-center space-y-4 relative z-10">
                <TrendingUp className="w-12 h-12 text-primary-500/20 mx-auto" />
                <p className="text-gray-500 text-sm font-medium">Detailed Growth Projections Placeholder</p>
             </div>
          </div>
          <div className="glass-card p-8 h-80 space-y-6">
             <h3 className="text-lg font-semibold text-white">System Security</h3>
             <div className="space-y-4">
                {[
                   { label: 'Network integrity', status: 'Secure', icon: ShieldCheck, color: 'text-emerald-400' },
                   { label: 'Data encryption', status: 'Active', icon: ShieldCheck, color: 'text-emerald-400' },
                   { label: 'Access control', status: 'Optimal', icon: ShieldCheck, color: 'text-emerald-400' }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <item.icon className={`w-4 h-4 ${item.color}`} />
                         <span className="text-sm text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase">{item.status}</span>
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
