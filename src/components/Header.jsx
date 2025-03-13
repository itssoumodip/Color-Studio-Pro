import { getContrastColor } from '../utils/colorUtils'

export default function Header({ color, viewMode, setViewMode, showInfo, setShowInfo, showPanel, setShowPanel }) {
  const textColor = getContrastColor(color)
  
  return (
    <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <div 
          className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg flex gap-2 items-center" 
          style={{ color: textColor }}
        >
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Color Studio Pro
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        {/* View mode switcher */}
        <div className="bg-white/10 backdrop-blur-xl rounded-full p-1 flex">
          <button 
            onClick={() => setViewMode('full')} 
            className={`p-2 rounded-full ${viewMode === 'full' ? 'bg-white/20' : ''} transition-all`}
            style={{ color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('split')} 
            className={`p-2 rounded-full ${viewMode === 'split' ? 'bg-white/20' : ''} transition-all`}
            style={{ color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1"></rect>
              <rect x="14" y="3" width="7" height="18" rx="1"></rect>
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('palette')} 
            className={`p-2 rounded-full ${viewMode === 'palette' ? 'bg-white/20' : ''} transition-all`}
            style={{ color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </button>
        </div>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="bg-white/10 backdrop-blur-xl p-2.5 rounded-full shadow-lg hover:bg-white/20 transition-all"
          style={{ color: textColor }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        
        <button 
          onClick={() => setShowPanel(!showPanel)}
          className="bg-white/10 backdrop-blur-xl p-2.5 rounded-full shadow-lg hover:bg-white/20 transition-all"
          style={{ color: textColor }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${showPanel ? 'rotate-180' : 'rotate-0'}`}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </header>
  )
}