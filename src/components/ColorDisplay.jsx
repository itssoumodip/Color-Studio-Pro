import { motion, AnimatePresence } from 'framer-motion';
import { getContrastColor } from '../utils/colorUtils';
import { useState, useEffect } from 'react';

export default function ColorDisplay({ 
  color, complementary, rgb, viewMode, 
  copied, toggleFavorite, favorites,
  showInfo, setShowInfo, copyToClipboard
}) {
  const textColor = getContrastColor(color);
  const [activeTab, setActiveTab] = useState('hex');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (viewMode === 'full') {
    return (
      <div className="h-full w-full relative flex flex-col justify-center items-center">
        {/* Background color with gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"
          animate={{ backgroundColor: color }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Interactive color card */}
        <div className={`relative z-10 w-full max-w-lg mx-auto px-4 ${showInfo ? 'scale-95 opacity-80' : ''} transition-all duration-300`}>
          <motion.div 
            className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
            animate={{ backgroundColor: `${color}10` }}
            transition={{ duration: 0.3 }}
          >
            {/* Color preview bar */}
            <div className="h-28 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0" 
                animate={{ backgroundColor: color }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>
            
            {/* Color information section */}
            <div className="p-6 sm:p-8">
              {/* Tabs */}
              <div className="flex mb-5 bg-white/10 rounded-full p-1">
                <button
                  onClick={() => setActiveTab('hex')}
                  className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'hex' ? 'bg-white/20 shadow-sm' : ''
                  }`}
                  style={{ color: textColor }}
                >
                  HEX
                </button>
                <button
                  onClick={() => setActiveTab('rgb')}
                  className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'rgb' ? 'bg-white/20 shadow-sm' : ''
                  }`}
                  style={{ color: textColor }}
                >
                  RGB
                </button>
                <button
                  onClick={() => setActiveTab('hsl')}
                  className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'hsl' ? 'bg-white/20 shadow-sm' : ''
                  }`}
                  style={{ color: textColor }}
                >
                  HSL
                </button>
              </div>
              
              {/* Color value */}
              <div className="mt-4 mb-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'hex' && (
                    <motion.div
                      key="hex"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between"
                    >
                      <h2 
                        className="text-4xl sm:text-5xl font-mono font-bold tracking-tight" 
                        style={{ color: textColor }}
                      >
                        {color.toUpperCase()}
                      </h2>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(color)}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        style={{ color: textColor }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {activeTab === 'rgb' && (
                    <motion.div
                      key="rgb"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between"
                    >
                      <h2 
                        className="text-3xl sm:text-4xl font-mono font-bold tracking-tight" 
                        style={{ color: textColor }}
                      >
                        rgb({rgb.r}, {rgb.g}, {rgb.b})
                      </h2>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        style={{ color: textColor }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {activeTab === 'hsl' && (
                    <motion.div
                      key="hsl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between"
                    >
                      <h2 
                        className="text-3xl sm:text-4xl font-mono font-bold tracking-tight" 
                        style={{ color: textColor }}
                      >
                        {rgbToHslString(rgb.r, rgb.g, rgb.b)}
                      </h2>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(rgbToHslString(rgb.r, rgb.g, rgb.b))}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        style={{ color: textColor }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* RGB color components */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-60" style={{ color: textColor }}>Red</div>
                  <div className="text-xl font-mono font-bold" style={{ color: textColor }}>{rgb.r}</div>
                  <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(rgb.r / 255) * 100}%` }}></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-60" style={{ color: textColor }}>Green</div>
                  <div className="text-xl font-mono font-bold" style={{ color: textColor }}>{rgb.g}</div>
                  <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(rgb.g / 255) * 100}%` }}></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-60" style={{ color: textColor }}>Blue</div>
                  <div className="text-xl font-mono font-bold" style={{ color: textColor }}>{rgb.b}</div>
                  <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(rgb.b / 255) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex justify-center items-center space-x-2"
                  style={{ color: textColor }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Color Details</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className={`flex-1 py-3 rounded-xl ${favorites?.includes(color) ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 transition-colors text-sm font-medium flex justify-center items-center space-x-2`}
                  style={{ color: textColor }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill={favorites?.includes(color) ? "currentColor" : "none"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{favorites?.includes(color) ? 'Saved to Favorites' : 'Save to Favorites'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Complementary color preview - updated for mobile */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex justify-center">
            <motion.div 
              className="backdrop-blur-md bg-white/10 rounded-xl px-5 py-3 flex items-center space-x-3 border border-white/10 shadow-lg"
              animate={{ backgroundColor: `${complementary}20` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard(complementary)}
            >
              <div 
                className="w-6 h-6 rounded-full border border-white/30 shadow-sm"
                style={{ backgroundColor: complementary }}
              />
              <span style={{ color: textColor }} className="text-sm font-medium">
                {isMobile ? complementary : `Complementary: ${complementary}`}
              </span>
            </motion.div>
          </div>
        </div>
        
        {/* Detailed color info modal */}
        <AnimatePresence>
          {showInfo && (
            <ColorInfoModal 
              color={color} 
              complementary={complementary} 
              rgb={rgb}
              textColor={textColor}
              setShowInfo={setShowInfo}
              copyToClipboard={copyToClipboard}
            />
          )}
        </AnimatePresence>
        
        {/* Copy notification */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-lg bg-black/70 text-white px-5 py-3 rounded-full shadow-xl font-medium text-sm flex items-center space-x-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 22 12 22C7.02944 22 3 17.5228 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  if (viewMode === 'split') {
    return (
      <div className="h-full w-full flex flex-col sm:flex-row">
        <motion.div 
          className="flex-1 flex flex-col justify-center items-center p-4"
          animate={{ backgroundColor: color }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: textColor }}>
              {color}
            </h2>
            <p className="opacity-70 mb-4" style={{ color: textColor }}>
              Primary Color
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(color)}
              className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              style={{ color: textColor }}
            >
              Copy HEX
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 flex flex-col justify-center items-center p-4"
          animate={{ backgroundColor: complementary }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: getContrastColor(complementary) }}>
              {complementary}
            </h2>
            <p className="opacity-70 mb-4" style={{ color: getContrastColor(complementary) }}>
              Complementary
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(complementary)}
              className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              style={{ color: getContrastColor(complementary) }}
            >
              Copy HEX
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (viewMode === 'palette') {
    // Generate color variants
    const shades = generateShades(color);
    
    return (
      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5">
        {shades.map((shade, index) => (
          <motion.div 
            key={shade}
            className="flex flex-col justify-center items-center cursor-pointer p-4"
            animate={{ backgroundColor: shade }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(shade)}
            whileHover={{ scale: 0.97 }}
          >
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-xl font-mono text-center" style={{ color: getContrastColor(shade) }}>
                {shade}
              </p>
              <p className="text-sm opacity-70 text-center mt-1" style={{ color: getContrastColor(shade) }}>
                {getShadeLabel(index)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  return null;
}

// Color info modal component with modern design
function ColorInfoModal({ color, complementary, rgb, textColor, setShowInfo, copyToClipboard }) {
  const complementTextColor = getContrastColor(complementary);
  const shades = generateShades(color);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    console.log("isMobile state:", isMobile);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/30"
      onClick={() => setShowInfo(false)}
    >
      <motion.div 
        className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-24 relative" style={{ backgroundColor: color }}>
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-lg"
            onClick={() => setShowInfo(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6" style={{ color: textColor }}>Color Details</h2>
          
          {/* Color values */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium opacity-60" style={{ color: textColor }}>HEX</p>
                <p className="font-mono font-bold" style={{ color: textColor }}>{color}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(color)}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                style={{ color: textColor }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium opacity-60" style={{ color: textColor }}>RGB</p>
                <p className="font-mono font-bold" style={{ color: textColor }}>{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                style={{ color: textColor }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Complementary color section */}
          <div className="mb-6">
            <p className="text-xs font-medium opacity-60 mb-2" style={{ color: textColor }}>COMPLEMENTARY</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: complementary }}
              ></div>
              <div className="flex-1 flex justify-between items-center">
                <p className="font-mono font-bold" style={{ color: textColor }}>{complementary}</p>
                <button 
                  onClick={() => copyToClipboard(complementary)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all"
                  style={{ color: textColor }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M16 3H10C8.89543 3 8 3.89543 8 5V15C8 16.1046 8.89543 17 10 17H20C21.1046 17 22 16.1046 22 15V9L16 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Color shades */}
          <div>
            <p className="text-xs font-medium opacity-60 mb-3" style={{ color: textColor }}>COLOR PALETTE</p>
            <div className="flex space-x-2">
              {shades.map(shade => (
                <div 
                  key={shade}
                  className="flex-1 h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: shade }}
                  onClick={() => copyToClipboard(shade)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function generateShades(hex, count = 5) {
  const { r, g, b } = hexToRgb(hex);
  const shades = [];
  
  // Generate a lighter to darker gradient
  for (let i = 0; i < count; i++) {
    // Calculate the mix factor (0 = white, 1 = original color, 2 = black)
    const factor = i / (count - 1) * 2;
    
    let newR, newG, newB;
    
    if (factor <= 1) {
      // Mix with white for lighter shades
      newR = Math.round(255 - (255 - r) * factor);
      newG = Math.round(255 - (255 - g) * factor);
      newB = Math.round(255 - (255 - b) * factor);
    } else {
      // Mix with black for darker shades
      const darkFactor = factor - 1;
      newR = Math.round(r * (1 - darkFactor));
      newG = Math.round(g * (1 - darkFactor));
      newB = Math.round(b * (1 - darkFactor));
    }
    
    const hexValue = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    shades.push(hexValue);
  }
  
  return shades;
}

function getShadeLabel(index) {
  const labels = ["Lightest", "Light", "Base", "Dark", "Darkest"];
  return labels[index] || `Shade ${index + 1}`;
}

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
    h /= 6;
  }
  
  return { h, s, l };
}

function rgbToHslString(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b);
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export { ColorInfoModal };