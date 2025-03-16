import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorPanel from './components/ColorPanel'
import ColorDisplay from './components/ColorDisplay'
import Header from './components/Header'
import { hexToRgb, getContrastColor, getComplementaryColor } from './utils/colorUtils'
import './index.css';
import ColorWheel from './components/ColorWheel';
import { ColorInfoModal } from './components/ColorDisplay';

function App() {
 
  const [color, setColor] = useState("#6366f1") 
  const [showPanel, setShowPanel] = useState(false)
  const [colorHistory, setColorHistory] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [viewMode, setViewMode] = useState('full')
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('colors')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
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

  useEffect(() => {
    const savedFavorites = localStorage.getItem('colorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedHistory = localStorage.getItem('colorHistory');
    if (savedHistory) {
      setColorHistory(JSON.parse(savedHistory));
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleColorChange = (newColor) => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(newColor)) {
      setColor(newColor);
      
      if (!colorHistory.includes(newColor)) {
        const updatedHistory = [newColor, ...colorHistory.slice(0, 19)];
        setColorHistory(updatedHistory);
        localStorage.setItem('colorHistory', JSON.stringify(updatedHistory));
      }
    }
  }
  
  const rgb = hexToRgb(color);
  const textColor = getContrastColor(color);
  const complementary = getComplementaryColor(color);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col">
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
                <div className="lg:hidden w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-1"></div>

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
                  setShowPanel={setShowPanel}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
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
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowPanel(prevState => !prevState);
            }}
            className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden z-30"
            aria-label={showPanel ? "Close color panel" : "Open color panel"}
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
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
              strokeLinecap="round"
              strokeLinejoin="round"
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

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulsate {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.9;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}}/>
      </div>
    </div>
  )
}

export default App
