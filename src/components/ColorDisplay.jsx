import { getContrastColor } from '../utils/colorUtils';

export default function ColorDisplay({ 
  color, complementary, rgb, isLight, 
  viewMode, copied, setCopied, toggleFavorite, 
  favorites, copyToClipboard, showInfo, setShowInfo 
}) {
  const textColor = getContrastColor(color);
  const isFavorite = favorites.includes(color);
  
  return (
    <div className="relative flex-1 h-full">
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ backgroundColor: color }}
      />
      
      {/* Top controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          aria-label={showInfo ? "Hide color information" : "Show color information"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
        
        <button 
          onClick={toggleFavorite}
          className={`p-3 rounded-full ${isFavorite ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-md hover:bg-white/20 transition-all`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? textColor : "none"} stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        
        <button 
          onClick={() => copyToClipboard(color)}
          className={`p-3 rounded-full ${copied ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-md hover:bg-white/20 transition-all`}
          aria-label="Copy color code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      
      {/* Color info */}
      {showInfo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 rounded-3xl bg-white/10 backdrop-blur-lg shadow-2xl transition-all z-20">
          <h2 className="text-4xl font-bold mb-2" style={{ color: textColor }}>
            {color.toUpperCase()}
          </h2>
          <div className="mb-4 opacity-80" style={{ color: textColor }}>
            RGB: {rgb.r}, {rgb.g}, {rgb.b}
          </div>
          <div className="flex items-center justify-center gap-4">
            <div 
              className="p-4 rounded-xl shadow-lg" 
              style={{ backgroundColor: complementary, color: getContrastColor(complementary) }}
            >
              Complementary
            </div>
          </div>
        </div>
      )}
      
      {/* Copy notification */}
      {copied && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-sm font-medium py-2 px-4 rounded-full bg-white/10 backdrop-blur-md transition-all" style={{ color: textColor }}>
          Color copied to clipboard!
        </div>
      )}
    </div>
  );
}