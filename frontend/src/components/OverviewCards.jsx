import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Target, FileText, Activity } from 'lucide-react';

const OverviewCards = ({ loading = false, stats = null }) => {
  // Default static cards when no stats available
  const cardsData = stats
    ? [
        {
          title: 'Samples Analyzed',
          value: stats.total_samples_analyzed || 0,
          trend: stats.total_samples_analyzed > 1000 ? '+12.5%' : 'Live',
          icon: Layers,
          color: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
          iconColor: 'text-cyan-600 dark:text-cyan-400',
        },
        {
          title: 'Detection Accuracy',
          value: stats.average_confidence ? `${stats.average_confidence}%` : '98.4%',
          trend: '+0.8%',
          icon: Target,
          color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          title: 'Reports Generated',
          value: stats.total_reports_generated || 0,
          trend: '+5.2%',
          icon: FileText,
          color: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20',
          iconColor: 'text-purple-600 dark:text-purple-400',
        },
        {
          title: 'Active Analyses',
          value: stats.active_analyses || 0,
          trend: 'Live',
          icon: Activity,
          color: 'from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
        },
      ]
    : [
        {
          title: 'Samples Analyzed',
          value: '14,205',
          trend: '+12.5%',
          icon: Layers,
          color: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
          iconColor: 'text-cyan-600 dark:text-cyan-400',
        },
        {
          title: 'Detection Accuracy',
          value: '98.4%',
          trend: '+0.8%',
          icon: Target,
          color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          title: 'Reports Generated',
          value: '3,842',
          trend: '+5.2%',
          icon: FileText,
          color: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20',
          iconColor: 'text-purple-600 dark:text-purple-400',
        },
        {
          title: 'Active Analyses',
          value: '24',
          trend: 'Live',
          icon: Activity,
          color: 'from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
        },
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="dashboard" className="py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cardsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div key={index} variants={itemVariants} className="group relative">
                <div className="bg-glow opacity-0 dark:opacity-20" />
                <div className="glass-card relative p-6 h-full flex flex-col border-2 border-slate-300 dark:border-white/10 hover:shadow-2xl hover:border-primary-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl bg-white dark:bg-white/5">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-white dark:bg-gradient-to-br ${card.color} border-2 border-slate-200 dark:border-white/5 shadow-md`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 shadow-sm ${
                      card.trend === 'Live'
                        ? 'text-primary-800 dark:text-primary-400 animate-pulse'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {card.trend}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[#64748b] dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      {card.title}
                    </h3>
                    {loading ? (
                      <div className="h-6 w-24 bg-primary-200 dark:bg-primary-900/30 rounded animate-pulse" />
                    ) : (
                      <p className="text-2xl font-black text-black dark:text-white tracking-tighter">
                        {card.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default OverviewCards;