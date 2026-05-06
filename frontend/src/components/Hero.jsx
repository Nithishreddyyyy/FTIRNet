import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Droplets } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Phase 1 Active</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            AI-Powered <br />
            <span className="text-gradient">Microplastics</span> <br />
            Detection
          </h1>
          
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Advanced neural networks and computer vision to analyze, quantify, and map microplastic contamination with unprecedented accuracy and speed.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-primary-600 border border-transparent rounded-full hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 overflow-hidden">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                Start Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white focus:outline-none">
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            
            {/* Glassmorphism abstract layers */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-48 h-48 glass rounded-full flex items-center justify-center border-t-white/20 border-l-white/20"
            >
              <Droplets className="w-12 h-12 text-primary-400 opacity-50" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-64 h-64 glass rounded-3xl rotate-12 flex items-center justify-center border-t-white/20 border-l-white/20 overflow-hidden"
            >
               {/* Mock data grid lines */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
               <div className="w-16 h-16 rounded-full border border-accent-500/50 flex items-center justify-center">
                  <div className="w-8 h-8 bg-accent-500/50 rounded-full blur-md" />
               </div>
            </motion.div>

            {/* Central scanning ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-8 rounded-full border-2 border-dashed border-primary-500/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-white/5"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
