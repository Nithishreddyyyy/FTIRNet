import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import OverviewCards from '../components/OverviewCards';
import { LayoutDashboard, TrendingUp, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
  const { stats, modelUsage, loading, error, fetchStats } = useDashboard();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="pt-24 pb-6 px-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-gray-500 font-black uppercase tracking-wider">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 font-black">Error: {error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-6 py-3 bg-primary-700 text-white rounded-xl font-black uppercase tracking-wider hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-8 border-b-2 border-slate-400 dark:border-white/10"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-black dark:text-white flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl shadow-xl">
                <LayoutDashboard className="text-primary-800 dark:text-primary-500 w-7 h-7" />
              </div>
              <span className="text-gradient">Analytics Dashboard</span>
            </h1>
            <p className="text-sm text-[#1e293b] dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed">
              Real-time monitoring of microplastic detection and classification metrics from global analysis streams.
            </p>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="space-y-10">
          <div className="px-1">
            <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
              <TrendingUp className="text-primary-800 dark:text-primary-500 w-4.5 h-4.5" />
              System Performance
            </h2>
          </div>
          <OverviewCards loading={loading} stats={stats} />
        </div>

        {/* Model Usage */}
        {modelUsage && Object.keys(modelUsage).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
              Model Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(modelUsage).map(([modelId, data]) => (
                <div
                  key={modelId}
                  className="glass-card p-6 flex items-center justify-between border-primary-500/30 dark:border-white/10 shadow-xl bg-white dark:bg-white/5"
                >
                  <div>
                    <p className="text-base font-black text-[var(--heading-color)] capitalize tracking-tighter">
                      {data.name || modelId.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider mt-1">
                      {data.type || modelId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary-800 dark:text-primary-400">
                      {data.count}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider">
                      Runs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
