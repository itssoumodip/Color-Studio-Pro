import { motion } from 'framer-motion';
import { getContrastColor } from '../utils/colorUtils';

export default function Header({ color, textColor, viewMode, setViewMode, isDarkMode, toggleDarkMode }) {
  return (
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
        {/* Color Preview Chip */}
        <motion.div 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700"
          whileHover={{ scale: 1.03 }}
        >
          <div 
            className="w-4 h-4 rounded-full shadow-inner border border-slate-200 dark:border-slate-700" 
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 uppercase">
            {color}
          </span>
        </motion.div>
        
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </motion.button>

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
        
        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
}