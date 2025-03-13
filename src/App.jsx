import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorPanel from './components/ColorPanel'
import ColorDisplay from './components/ColorDisplay'
import Header from './components/Header'
import { hexToRgb, getContrastColor, getComplementaryColor } from './utils/colorUtils'
import './index.css';
import ColorWheel from './components/ColorWheel';

function App() {
  // State management
  const [color, setColor] = useState("#6366f1") // Starting with indigo
  const [showPanel, setShowPanel] = useState(false)
  const [colorHistory, setColorHistory] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [viewMode, setViewMode] = useState('full')
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('colors')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Extended color palette with modern colors
  const colors = [
    { name: "Indigo", hex: "#6366f1" },
    { name: "Cyan", hex: "#0ea5e9" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Violet", hex: "#8b5cf6" },
    { name: "Sky", hex: "#0284c7" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Lime", hex: "#84cc16" },
    { name: "Orange", hex: "#ea580c" },
    { name: "Fuchsia", hex: "#d946ef" },
    { name: "Stone", hex: "#78716c" },
  ]

  // Load saved favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('colorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedHistory = localStorage.getItem('colorHistory');
    if (savedHistory) {
      setColorHistory(JSON.parse(savedHistory));
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Handle color change
  const handleColorChange = (newColor) => {
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/i.test(newColor)) {
      setColor(newColor);
      
      // Add to history if not already present
      if (!colorHistory.includes(newColor)) {
        const updatedHistory = [newColor, ...colorHistory.slice(0, 19)];
        setColorHistory(updatedHistory);
        localStorage.setItem('colorHistory', JSON.stringify(updatedHistory));
      }
    }
  }
  
  // Calculate color properties
  const rgb = hexToRgb(color);
  const textColor = getContrastColor(color);
  const complementary = getComplementaryColor(color);
  
  // Copy color to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Toggle favorite
  const toggleFavorite = () => {
    let newFavorites;
    
    if (favorites.includes(color)) {
      newFavorites = favorites.filter(c => c !== color);
    } else {
      newFavorites = [...favorites, color];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('colorFavorites', JSON.stringify(newFavorites));
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <Header 
          color={color} 
          textColor={textColor}
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          showPanel={showPanel} 
          setShowPanel={setShowPanel}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        {/* Main content */}
        <main className="flex-1 relative">
          <ColorDisplay 
            color={color}
            complementary={complementary}
            rgb={rgb}
            viewMode={viewMode}
            copied={copied}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            copyToClipboard={copyToClipboard}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
          />
        </main>
        
        {/* Color panel drawer - conditionally rendered with animation */}
        <AnimatePresence>
          {showPanel && (
            <motion.div 
              key="panel-overlay"
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
            >
              <motion.div 
                key="panel-content"
                className="absolute bottom-0 left-0 right-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 bg-white dark:bg-slate-800 rounded-t-3xl lg:rounded-none lg:rounded-l-3xl shadow-2xl overflow-hidden"
                initial={{ y: "100%", x: 0 }}
                animate={{ y: 0, x: 0 }}
                exit={{ y: "100%", x: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <ColorPanel 
                  color={color}
                  handleColorChange={handleColorChange}
                  colors={colors}
                  colorHistory={colorHistory}
                  favorites={favorites}
                  setColor={setColor}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-center z-30">
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Color info button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-colors"
            style={{ color: textColor }}
            aria-label="Show color information"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4M12 8h.01"></path>
            </svg>
          </motion.button>
          
          {/* Copy button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => copyToClipboard(color)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-colors"
            style={{ color: textColor }}
            aria-label="Copy color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </motion.button>
          
          {/* Favorite button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-colors"
            style={{ color: textColor }}
            aria-label={favorites.includes(color) ? "Remove from favorites" : "Add to favorites"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill={favorites.includes(color) ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </motion.button>
          
          {/* Panel toggle button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              console.log('Toggle panel clicked, current state:', showPanel);
              setShowPanel(prevState => !prevState);
            }}
            className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden z-30"
            aria-label={showPanel ? "Close color panel" : "Open color panel"}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{ backgroundColor: color }}
              transition={{ duration: 0.3 }}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={isDarkMode ? "#fff" : "#000"} 
              strokeWidth="2"
              className="relative z-10"
            >
              {showPanel ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </>
              )}
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default App
