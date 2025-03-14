import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ColorWheel from './ColorWheel';

// Add this at the to p of your file, above the ColorPanel component
function Navbar({ setShowPanel, color, activeTab, setActiveTab }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    console.log("Toggle menu clicked. Current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };
                 
  return (
    <>
     

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            <nav className="p-4 space-y-3">
              {['wheel', 'colors', 'history', 'favorites'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
              
              <button
                onClick={() => navigator.clipboard.writeText(color)}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <span>Copy Color: {color.toUpperCase()}</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ColorPanel({ 
  color, handleColorChange, colors, colorHistory, 
  favorites, setColor, activeTab, setActiveTab, isDarkMode,
  setShowPanel // Add this prop
}) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipColor, setTooltipColor] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Add this state
  const wheelRef = useRef(null);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  // Initialize color wheel with current color when opened
  useEffect(() => {
    if (color) {
      const { h, s, l } = hexToHsl(color);
      setHue(h);
      setSaturation(s * 100);
      setLightness(l * 100);
    }
  }, [color]);
  
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Convert hsl values to hex and update color
  const updateColorFromWheel = (h, s, l) => {
    const hex = hslToHex(h, s / 100, l / 100);
    handleColorChange(hex);
  };

  // Handle mouse/touch interaction with color wheel
  const handleWheelInteraction = (e) => {
    if (!wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Get position relative to center
    let clientX, clientY;
    
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    // Calculate angle (hue) and distance from center (saturation)
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    const distance = Math.min(Math.sqrt(x * x + y * y), centerX);
    
    // Convert to color values
    const newHue = (angle + 360) % 360;
    const newSaturation = (distance / centerX) * 100;
    
    setHue(newHue);
    setSaturation(newSaturation);
    updateColorFromWheel(newHue, newSaturation, lightness);
  };

  // Show tooltip with color information
  const handleShowTooltip = (hex, e) => {
    setTooltipColor(hex);
    setTooltipPosition({ 
      x: e.clientX, 
      y: e.clientY - 40 
    });
    setShowTooltip(true);
  };

  // Move the regenerateSuggestions function here, inside the component
  const regenerateSuggestions = () => {
    // Generate new suggestions by slightly modifying the hue
    const newHue = (hue + Math.random() * 30 - 15 + 360) % 360;
    setHue(newHue);
    updateColorFromWheel(newHue, saturation, lightness);
  };
  
  // Tab item for reuse
  const TabItem = ({ id, label, icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
        activeTab === id 
          ? 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="lg:hidden">
        <Navbar 
          setShowPanel={setShowPanel} 
          color={color} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      </div>
      
     
      
      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm lg:hidden"
          >
            <div className="fixed right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-xl p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h3>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-4">
                {['wheel', 'colors', 'history', 'favorites'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab === 'wheel' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="0" fill="currentColor" fillOpacity="0.2" />
                      </svg>
                    )}
                    {tab === 'colors' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    )}
                    {tab === 'history' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {tab === 'favorites' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    <span className="capitalize">{tab}</span>
                  </button>
                ))}
              </nav>
              
              {/* Additional actions in mobile menu */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toggleMobileMenu();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Copy Color: {color.toUpperCase()}</span>
                  </button>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Close Color Panel</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="relative mr-2">
            <span className="w-5 h-5 rounded-full block" style={{ backgroundColor: color }}></span>
            <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }}></span>
          </span>
          Color Studio
        </h2>
        
        {/* Color code input */}
        <div className="relative">
          <input 
            type="text" 
            value={color} 
            onChange={(e) => handleColorChange(e.target.value)}
            className="px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white font-mono uppercase text-sm w-36"
          />
          <div 
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600" 
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex p-3 gap-1 bg-gray-100 dark:bg-gray-800/50">
        <TabItem 
          id="wheel" 
          label="Wheel" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="0" fill="currentColor" fillOpacity="0.2" />
            </svg>
          } 
        />
        <TabItem 
          id="colors" 
          label="Palette" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          } 
        />
        <TabItem 
          id="history" 
          label="History" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
        />
        <TabItem 
          id="favorites" 
          label="Saved" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          } 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {/* Color wheel tab */}
          {activeTab === 'wheel' && (
            <motion.div 
              key="wheel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center space-y-8"
            >
              <div className="relative w-full flex justify-center">
                <ColorWheel 
                  color={color} 
                  onChange={(newColor) => {
                    setColor(newColor);
                    handleColorChange(newColor);
                  }} 
                />
                
                
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-md z-20 flex items-center space-x-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="font-mono text-xs text-white">{color.toUpperCase()}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(color)}
                    className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                </motion.div>
              </div>

              {/* HSL controls and color suggestions */}
              <div className="w-full max-w-md space-y-6">
                {/* HSL values with modern cards */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 dark:border-gray-700/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hue</div>
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white flex items-baseline">
                      {Math.round(hue)}
                      <span className="text-xs ml-1 text-gray-500">°</span>
                    </div>
                    <div className="mt-3 h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full" />
                    <div className="mt-2 flex justify-between">
                      <button 
                        onClick={() => {
                          const newHue = (hue - 5 + 360) % 360;
                          setHue(newHue);
                          updateColorFromWheel(newHue, saturation, lightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          const newHue = (hue + 5) % 360;
                          setHue(newHue);
                          updateColorFromWheel(newHue, saturation, lightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 relative"
                      >
                        {/* Horizontal line */}
                        <div className="absolute left-1 right-1 top-1/2 h-0.5 bg-current transform -translate-y-1/2"></div>
                        {/* Vertical line */}
                        <div className="absolute top-1 bottom-1 left-1/2 w-0.5 bg-current transform -translate-x-1/2"></div>
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 dark:border-gray-700/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saturation</div>
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white flex items-baseline">
                      {Math.round(saturation)}
                      <span className="text-xs ml-1 text-gray-500">%</span>
                    </div>
                    <div className="mt-3 h-1.5 bg-gradient-to-r from-gray-300 to-blue-500 rounded-full" />
                    <div className="mt-2 flex justify-between">
                      <button 
                        onClick={() => {
                          const newSaturation = Math.max(0, saturation - 5);
                          setSaturation(newSaturation);
                          updateColorFromWheel(hue, newSaturation, lightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          const newSaturation = Math.min(100, saturation + 5);
                          setSaturation(newSaturation);
                          updateColorFromWheel(hue, newSaturation, lightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 dark:border-gray-700/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lightness</div>
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white flex items-baseline">
                      {Math.round(lightness)}
                      <span className="text-xs ml-1 text-gray-500">%</span>
                    </div>
                    <div className="mt-3 h-1.5 bg-gradient-to-r from-black via-gray-500 to-white rounded-full" />
                    <div className="mt-2 flex justify-between">
                      <button 
                        onClick={() => {
                          const newLightness = Math.max(0, lightness - 5);
                          setLightness(newLightness);
                          updateColorFromWheel(hue, saturation, newLightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          const newLightness = Math.min(100, lightness + 5);
                          setLightness(newLightness);
                          updateColorFromWheel(hue, saturation, newLightness);
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Lightness slider */}
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      <span>Brightness</span>
                    </label>
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-white px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      {Math.round(lightness)}%
                    </span>
                  </div>
                  
                  <div className="h-6 relative w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {/* Gradient background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to right, 
                          hsl(${hue}, ${saturation}%, 0%), 
                          hsl(${hue}, ${saturation}%, 50%), 
                          hsl(${hue}, ${saturation}%, 100%)
                        )`
                      }}
                    ></div>
                    
                    {/* Decorative tick marks */}
                    <div className="absolute inset-y-0 left-1/4 w-px h-full bg-white/20 pointer-events-none"></div>
                    <div className="absolute inset-y-0 left-1/2 w-px h-full bg-white/30 pointer-events-none"></div>
                    <div className="absolute inset-y-0 left-3/4 w-px h-full bg-white/20 pointer-events-none"></div>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightness}
                      onChange={(e) => {
                        const newLightness = parseInt(e.target.value);
                        setLightness(newLightness);
                        updateColorFromWheel(hue, saturation, newLightness);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      style={{ touchAction: 'none' }}
                    />
                    
                    {/* Slider thumb */}  
                    <motion.div 
                      className="absolute w-6 h-6 rounded-full bg-white shadow-lg top-1/2 z-10 pointer-events-none flex items-center justify-center"
                      style={{ 
                        left: `${lightness}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 0 2px rgba(255,255,255,0.5)', 
                          '0 0 0 4px rgba(255,255,255,0.2)', 
                          '0 0 0 2px rgba(255,255,255,0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Suggestion colors based on current selection */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Suggestions</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={regenerateSuggestions}
                    >
                      Regenerate
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {[0.8, 0.6, 0.4, 0.2, 0.1].map((factor, index) => {
                      const suggestedHex = hslToHex(hue, saturation / 100, factor);
                      return (
                        <motion.div
                          key={factor}
                          whileHover={{ 
                            scale: 1.1, 
                            y: -5,
                            boxShadow: "0 12px 25px -5px rgba(0, 0, 0, 0.15)"
                          }}
                          className="relative"
                        >
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setColor(suggestedHex)}
                            onMouseEnter={(e) => handleShowTooltip(suggestedHex, e)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="w-full aspect-square rounded-xl shadow-md border-2 transition-all overflow-hidden relative"
                            style={{ 
                              backgroundColor: suggestedHex,
                              borderColor: suggestedHex === color ? 'white' : 'transparent'
                            }}
                            aria-label={`Use suggested color ${index + 1}`}
                          >
                            {suggestedHex === color && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-white/80"></div>
                              </motion.div>
                            )}
                          </motion.button>
                          <motion.div 
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 text-[10px] px-1.5 py-0.5 rounded-full shadow-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ opacity: suggestedHex === color ? 0.7 : 0 }}
                            animate={{ opacity: suggestedHex === color ? 0.7 : 0 }}
                          >
                            {Math.round(factor * 100)}%
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Preset colors tab */}
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Color Palette</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {colors.map((colorObj) => (
                  <motion.button
                    key={colorObj.hex}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setColor(colorObj.hex)}
                    onMouseEnter={(e) => handleShowTooltip(colorObj.hex, e)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative aspect-square rounded-xl border-2 transition-all"
                    style={{ 
                      backgroundColor: colorObj.hex,
                      borderColor: colorObj.hex === color ? 'white' : 'transparent'
                    }}
                  >
                    {colorObj.hex === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/80"></div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Color shades section */}
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 mt-8">Shades & Tints</h3>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-3 min-w-max">
                  {[...Array(9)].map((_, i) => {
                    const shade = i * 100 + 100;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setColor(getTailwindShade(color, shade))}
                          onMouseEnter={(e) => handleShowTooltip(getTailwindShade(color, shade), e)}
                          onMouseLeave={() => setShowTooltip(false)}
                          className="w-10 h-10 rounded-lg shadow-md border-2 transition-all"
                          style={{ 
                            backgroundColor: getTailwindShade(color, shade),
                            borderColor: getTailwindShade(color, shade) === color ? 'white' : 'transparent'
                          }}
                        />
                        <span className="text-xs mt-1 text-gray-500">{shade}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* History tab */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Colors</h3>
                {colorHistory.length > 0 && (
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      localStorage.removeItem('colorHistory');
                      window.location.reload();
                    }}
                  >
                    Clear History
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {colorHistory.length > 0 ? (
                  colorHistory.map((hex) => (
                    <motion.button
                      key={hex}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColor(hex)}
                      onMouseEnter={(e) => handleShowTooltip(hex, e)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="aspect-square rounded-xl shadow-sm border-2 transition-all relative overflow-hidden"
                      style={{ 
                        backgroundColor: hex,
                        borderColor: hex === color ? 'white' : 'transparent'
                      }}
                    >
                      {hex === color && (
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white/80"></div>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                      No color history yet. Colors you select will appear here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Favorites tab */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Colors</h3>
                {favorites.length > 0 && (
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      localStorage.removeItem('colorFavorites');
                      window.location.reload();
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {favorites.length > 0 ? (
                  favorites.map((hex) => (
                    <motion.div
                      key={hex}
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setColor(hex)}
                        onMouseEnter={(e) => handleShowTooltip(hex, e)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="w-full aspect-square rounded-xl shadow-md border-2 transition-all"
                        style={{ 
                          backgroundColor: hex,
                          borderColor: hex === color ? 'white' : 'transparent'
                        }}
                      />
                      
                      {/* Favorite heart icon */}
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                      No saved colors yet. Click the heart button in the main view to save colors.
                    </p>
                    <button 
                      onClick={() => setActiveTab('wheel')}
                      className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Start Picking Colors
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Color tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 px-3 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex items-center space-x-2 border border-gray-200 dark:border-gray-700 pointer-events-none"
            style={{ 
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)'
            }}
          >
            <div 
              className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" 
              style={{ backgroundColor: tooltipColor }}
            />
            <span className="font-mono text-xs text-gray-800 dark:text-gray-200 uppercase">{tooltipColor}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions for color conversion
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h *= 60;
  }
  
  return { h, s, l };
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, (h / 360) + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  
  const toHex = x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// New helper function for Tailwind-style color shades
function getTailwindShade(hexColor, shade) {
  // Convert hex to hsl
  const { h, s, l } = hexToHsl(hexColor);
  // Adjust lightness based on shade
  const newLightness = l * (shade / 1000);
  // Convert back to hex
  return hslToHex(h, s, newLightness);
}