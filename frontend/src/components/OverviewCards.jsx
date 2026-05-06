import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Target, FileText, Activity } from 'lucide-react';

const cardsData = [
  {
    title: 'Samples Analyzed',
    value: '14,205',
    trend: '+12.5%',
    icon: Layers,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    title: 'Detection Accuracy',
    value: '98.4%',
    trend: '+0.8%',
    icon: Target,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'Reports Generated',
    value: '3,842',
    trend: '+5.2%',
    icon: FileText,
    color: 'from-purple-500/20 to-indigo-500/20',
    iconColor: 'text-purple-400'
  },
  {
    title: 'Active Analyses',
    value: '24',
    trend: 'Live',
    icon: Activity,
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const OverviewCards = () => {
  return (
    <section id="dashboard" className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">System Overview</h2>
          <p className="text-sm text-gray-400">Real-time metrics from the global detection network.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cardsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="bg-glow" />
                
                {/* Card Content */}
                <div className="glass-card relative p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border border-white/5`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10 ${card.trend === 'Live' ? 'text-primary-400 animate-pulse' : 'text-emerald-400'}`}>
                      {card.trend}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                    <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
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
