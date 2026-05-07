import React from 'react';
import { Microscope, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'FTIR Analysis', path: '/ftir-analysis' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between border-white/10 shadow-2xl">
          
          {/* Logo & Project Name */}
          <NavLink to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-colors">
              <Microscope className="w-5 h-5 text-primary-500" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Microplastics AI
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/');
              
              return (
                <NavLink 
                  key={link.name} 
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive: linkActive }) => 
                    `px-4 py-2 text-sm font-medium transition-all duration-300 relative group
                    ${linkActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`
                  }
                >
                  {({ isActive: linkActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      
                      {/* Smooth Underline Transition */}
                      {linkActive && (
                        <motion.div 
                          layoutId="activeUnderline"
                          className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30
                          }}
                        />
                      )}
                      
                      {/* Hover Effect Glow */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Section: Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search analysis..." 
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-200 w-36 lg:w-48 transition-all focus:w-48 lg:focus:w-64 placeholder:text-gray-600"
              />
            </div>
            <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors relative group">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <User className="w-4 h-4 text-gray-300 relative z-10" />
            </button>
          </div>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
