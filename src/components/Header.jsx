import { motion } from 'framer-motion';
import { getContrastColor } from '../utils/colorUtils';

export default function Header({ color, textColor, viewMode, setViewMode, isDarkMode, toggleDarkMode }) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="px-4 py-5 flex justify-between items-center z-30 relative"
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            <span>Color</span>
            <span className="text-indigo-600 dark:text-indigo-400">Studio</span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View mode switcher - hidden on mobile */}
        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-700 rounded-full p-1">
          <button 
            onClick={() => setViewMode('full')} 
            className={`p-2 rounded-full ${viewMode === 'full' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''} transition-all`}
            aria-label="Full view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('split')} 
            className={`p-2 rounded-full ${viewMode === 'split' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''} transition-all`}
            aria-label="Split view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="8" height="18" rx="1"></rect>
              <rect x="13" y="3" width="8" height="18" rx="1"></rect>
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('palette')} 
            className={`p-2 rounded-full ${viewMode === 'palette' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''} transition-all`}
            aria-label="Palette view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
              <circle cx="7.5" cy="11.5" r="1.5"></circle>
              <circle cx="7.5" cy="7.5" r="1.5"></circle>
              <circle cx="11.5" cy="5.5" r="1.5"></circle>
              <circle cx="15.5" cy="7.5" r="1.5"></circle>
            </svg>
          </button>
        </div>
        
        {/* Dark mode toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </motion.header>
  );
}