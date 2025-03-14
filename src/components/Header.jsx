import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContrastColor } from '../utils/colorUtils';

export default function Header({ color, textColor, viewMode, setViewMode, isDarkMode, toggleDarkMode }) {
  // Add state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu function
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-4 flex justify-between items-center z-30 sticky top-0 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm"
      >
        <div className="flex items-center">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative">
              <motion.div 
                className="w-8 h-8 rounded-xl shadow-lg flex items-center justify-center overflow-hidden" 
                style={{ backgroundColor: color }}
                animate={{
                  boxShadow: [
                    `0 0 0 2px rgba(255,255,255,0.8)`, 
                    `0 0 0 4px ${color}30`,
                    `0 0 0 2px rgba(255,255,255,0.8)`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
              </motion.div>
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1 h-1 rounded-full bg-white"></div>
              </motion.div>
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-baseline">
              <span>Color</span>
              <span className="text-indigo-600 dark:text-indigo-400">Studio</span>
              <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-md">Pro</span>
            </h1>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View mode switcher - improved visibility */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 shadow-inner">
            <motion.button 
              onClick={() => setViewMode('full')} 
              className={`p-2 rounded-lg ${viewMode === 'full' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'} transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Full view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${viewMode === 'full' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              </svg>
            </motion.button>
            <motion.button 
              onClick={() => setViewMode('split')} 
              className={`p-2 rounded-lg ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'} transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Split view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${viewMode === 'split' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="8" height="18" rx="1"></rect>
                <rect x="13" y="3" width="8" height="18" rx="1"></rect>
              </svg>
            </motion.button>
            <motion.button 
              onClick={() => setViewMode('palette')} 
              className={`p-2 rounded-lg ${viewMode === 'palette' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'} transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Palette view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${viewMode === 'palette' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                <circle cx="7.5" cy="11.5" r="1.5"></circle>
                <circle cx="7.5" cy="7.5" r="1.5"></circle>
                <circle cx="11.5" cy="5.5" r="1.5"></circle>
                <circle cx="15.5" cy="7.5" r="1.5"></circle>
              </svg>
            </motion.button>
          </div>
          
          {/* Mobile menu button - now with functionality */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span 
                className={`block h-0.5 w-4 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                }`}
              ></span>
              <span 
                className={`block h-0.5 w-4 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span 
                className={`block h-0.5 w-4 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                }`}
              ></span>
            </div>
          </motion.button>
        </div>
      </motion.header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* View mode buttons for mobile */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">View Mode</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setViewMode('full');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      viewMode === 'full' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('split');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      viewMode === 'split' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="8" height="18" rx="1"></rect>
                      <rect x="13" y="3" width="8" height="18" rx="1"></rect>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('palette');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      viewMode === 'palette' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                      <circle cx="7.5" cy="11.5" r="1.5"></circle>
                      <circle cx="7.5" cy="7.5" r="1.5"></circle>
                      <circle cx="11.5" cy="5.5" r="1.5"></circle>
                      <circle cx="15.5" cy="7.5" r="1.5"></circle>
                    </svg>
                  </button>
                </div>
              </div>
              
             
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}