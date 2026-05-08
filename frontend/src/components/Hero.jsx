import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Droplets } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 pb-10 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-primary-600/10 dark:bg-primary-500/20 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-100 transition-all duration-1000" />
      <div className="absolute bottom-1/4 -left-64 w-[400px] h-[400px] bg-accent-600/10 dark:bg-accent-500/20 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-100 transition-all duration-1000" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-black dark:text-white">
            AI-Powered <br />
            <span className="text-gradient">Microplastics</span> <br />
            Detection
          </h1>
          
          <p className="text-xl text-[#1e293b] dark:text-gray-400 max-w-xl leading-relaxed font-bold">
            Advanced neural networks and computer vision to analyze, quantify, and map microplastic contamination with unprecedented accuracy and speed.
          </p>
          
          <div className="flex flex-wrap items-center gap-8 pt-6">
            <button className="group relative inline-flex items-center justify-center px-12 py-5 text-sm font-black text-white transition-all duration-300 bg-black dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-500 rounded-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-4 focus:ring-primary-700 overflow-hidden uppercase tracking-[0.25em] hover:-translate-y-1.5 active:translate-y-0 shadow-2xl">
              <span className="relative flex items-center gap-3">
                Start Analysis <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            <button className="inline-flex items-center justify-center px-12 py-5 text-sm font-black text-black dark:text-gray-300 transition-all duration-300 bg-white dark:bg-white/5 border-2 border-slate-400 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-2xl hover:text-black dark:hover:text-white focus:outline-none uppercase tracking-[0.25em] shadow-xl">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Content - Abstract Scientific Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Glowing orb */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-accent-500/30 dark:from-primary-500/20 dark:to-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            
            {/* Glassmorphism abstract layers */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-48 h-48 glass rounded-full flex items-center justify-center border-white/40 dark:border-white/20 shadow-xl"
            >
              <Droplets className="w-12 h-12 text-primary-500 dark:text-primary-400 opacity-60 dark:opacity-50" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-64 h-64 glass rounded-3xl rotate-12 flex items-center justify-center border-white/40 dark:border-white/20 shadow-xl overflow-hidden"
            >
               {/* Mock data grid lines */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e91a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e91a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
               <div className="w-16 h-16 rounded-full border-2 border-accent-500/30 dark:border-accent-500/50 flex items-center justify-center bg-accent-500/5">
                  <div className="w-8 h-8 bg-accent-500/40 rounded-full blur-md" />
               </div>
            </motion.div>

            {/* Central scanning ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-8 rounded-full border-2 border-dashed border-primary-500/40 dark:border-primary-500/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-primary-500/20 dark:border-white/5"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
