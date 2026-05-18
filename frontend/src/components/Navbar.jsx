import React from 'react';
import { Microscope, Search, User, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'FTIR Analysis', path: '/ftir-analysis' },
    { name: 'Peak Identifier', path: '/graph-peak' },
    { name: 'Molecular Structure', path: '/molecular-structure' },
    { name: 'Reports', path: '/reports' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-full px-6 py-2 flex items-center justify-between shadow-xl border-primary-500/30 dark:border-white/10 bg-slate-100/90 dark:bg-black/20 backdrop-blur-xl">
          
          {/* Logo & Project Name */}
          <NavLink to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-primary-700/10 dark:bg-primary-500/20 rounded-full group-hover:bg-primary-700/20 dark:group-hover:bg-primary-500/30 transition-all shadow-sm border border-primary-500/20">
              <Microscope className="w-5 h-5 text-primary-800 dark:text-primary-500" />
            </div>
            <span className="font-black text-lg tracking-tighter text-black dark:text-white">
              Microplastics AI
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              return (
                <NavLink 
                  key={link.name} 
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive: linkActive }) => 
                    `px-4 py-1.5 text-[10px] font-black transition-all duration-300 relative group uppercase tracking-[0.2em]
                    ${linkActive ? 'text-black font-extrabold dark:text-white' : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`
                  }
                >
                  {({ isActive: linkActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      
                      {/* Smooth Underline Transition */}
                      {linkActive && (
                        <motion.div 
                          layoutId="activeUnderline"
                          className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-primary-600 to-accent-600 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.4)] dark:shadow-[0_0_12px_rgba(14,165,233,0.5)]"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30
                          }}
                        />
                      )}
                      
                      {/* Hover Effect Glow */}
                      <div className="absolute inset-0 bg-primary-500/5 dark:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Section: Search & Profile & Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block group/search">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-800 dark:text-gray-400 group-focus-within/search:text-primary-800 transition-colors" />
              <input 
                type="text" 
                placeholder="Search analysis..." 
                className="bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full py-1.5 pl-10 pr-4 text-[10px] font-black focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-gray-100 w-40 lg:w-48 transition-all focus:w-48 lg:focus:w-64 placeholder:text-slate-600 dark:placeholder:text-gray-600 shadow-sm"
              />
            </div>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full transition-all relative group overflow-hidden shadow-sm"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: 15, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -15, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-primary-400 relative z-10" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600 relative z-10" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            <button className="p-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full transition-all relative group shadow-sm">
              <User className="w-4 h-4 text-slate-600 dark:text-gray-300 relative z-10" />
            </button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
