import { useState, useEffect } from 'react'
import ColorPanel from './components/ColorPanel'
import ColorDisplay from './components/ColorDisplay'
import { hexToRgb, getContrastColor, getComplementaryColor } from './utils/colorUtils'

function App() {
  const [color, setColor] = useState("#212121")
  const [showPanel, setShowPanel] = useState(true)
  const [colorHistory, setColorHistory] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [viewMode, setViewMode] = useState('full') // 'full', 'split', 'palette'
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('colors') // 'colors', 'saved', 'custom'
  
  // Extended color palette
  const colors = [
    { name: "Red", textColor: "white", hex: "#FF5252" },
    { name: "Green", textColor: "white", hex: "#4CAF50" },
    { name: "Blue", textColor: "white", hex: "#2196F3" },
    { name: "Purple", textColor: "white", hex: "#9C27B0" },
    { name: "Coral", textColor: "white", hex: "#FF7F50" },
    { name: "Teal", textColor: "white", hex: "#008080" },
    { name: "Indigo", textColor: "white", hex: "#3F51B5" },
    { name: "Black", textColor: "white", hex: "#212121" },
    { name: "Yellow", textColor: "black", hex: "#FFEB3B" },
    { name: "Mint", textColor: "black", hex: "#98FB98" },
  ]

  // Load saved favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('colorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleColorChange = (newColor) => {
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/i.test(newColor)) {
      setColor(newColor);
      
      // Add to history if not already present
      if (!colorHistory.includes(newColor)) {
        setColorHistory(prev => [newColor, ...prev.slice(0, 19)]);
      }
    }
  }
  
  // Calculate color properties
  const rgb = hexToRgb(color);
  const isLight = (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 150;
  const complementary = getComplementaryColor(color);

  // Copy color to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Toggle favorite
  const toggleFavorite = () => {
    if (favorites.includes(color)) {
      const newFavorites = favorites.filter(c => c !== color);
      setFavorites(newFavorites);
      localStorage.setItem('colorFavorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, color];
      setFavorites(newFavorites);
      localStorage.setItem('colorFavorites', JSON.stringify(newFavorites));
    }
  }

  // Toggle panel
  const togglePanel = () => {
    setShowPanel(!showPanel);
  }

  const textColor = getContrastColor(color);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Main color display */}
      <ColorDisplay 
        color={color}
        complementary={complementary}
        rgb={rgb}
        isLight={isLight}
        viewMode={viewMode}
        copied={copied}
        setCopied={setCopied}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
        copyToClipboard={copyToClipboard}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />
      
      {/* Color panel */}
      <ColorPanel 
        showPanel={showPanel}
        color={color}
        handleColorChange={handleColorChange}
        colors={colors}
        colorHistory={colorHistory}
        favorites={favorites}
        setColor={setColor}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Toggle panel button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 rounded-full bg-white/10 backdrop-blur-md p-3 shadow-lg hover:bg-white/20 transition-all"
        aria-label={showPanel ? "Hide color panel" : "Show color panel"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {showPanel ? (
            <polyline points="18 15 12 9 6 15"></polyline>
          ) : (
            <polyline points="6 9 12 15 18 9"></polyline>
          )}
        </svg>
      </button>
    </div>
  )
}

export default App
