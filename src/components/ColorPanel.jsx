import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ColorPanel({ 
  color, handleColorChange, colors, colorHistory, 
  favorites, setColor, activeTab, setActiveTab, isDarkMode
}) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const wheelRef = useRef(null);

  // Initialize color wheel with current color when opened
  useEffect(() => {
    if (color) {
      const { h, s, l } = hexToHsl(color);
      setHue(h);
      setSaturation(s * 100);
      setLightness(l * 100);
    }
  }, [color]);

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

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Color Studio</h2>
      
      {/* Tab navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('wheel')}
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'wheel' 
              ? 'bg-white dark:bg-gray-800 shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Wheel
        </button>
        <button 
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'colors' 
              ? 'bg-white dark:bg-gray-800 shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Colors
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'history' 
              ? 'bg-white dark:bg-gray-800 shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 rounded-md text-sm font-medium ${
            activeTab === 'favorites' 
              ? 'bg-white dark:bg-gray-800 shadow-sm' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Favorites
        </button>
      </div>
      
      {/* Color input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Color
        </label>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 shadow-inner" 
            style={{ backgroundColor: color }}
          ></div>
          <input 
            type="text" 
            value={color} 
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono uppercase"
          />
        </div>
      </div>
      
      {/* Color wheel tab */}
      {activeTab === 'wheel' && (
        <div className="flex flex-col items-center space-y-6">
          {/* Color wheel */}
          <div 
            ref={wheelRef}
            className="relative w-64 h-64 rounded-full shadow-lg"
            style={{
              background: `conic-gradient(
                hsl(0, 100%, 50%),
                hsl(60, 100%, 50%),
                hsl(120, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(240, 100%, 50%),
                hsl(300, 100%, 50%),
                hsl(360, 100%, 50%)
              )`
            }}
            onMouseDown={(e) => {
              handleWheelInteraction(e);
              
              const handleMouseMove = (moveEvent) => {
                handleWheelInteraction(moveEvent);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              handleWheelInteraction(e);
              
              const handleTouchMove = (moveEvent) => {
                handleWheelInteraction(moveEvent);
              };
              
              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
          >
            {/* White overlay to create saturation gradient */}
            <div className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
              }}
            ></div>
            
            {/* Selected color indicator */}
            <div
              className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
              style={{
                backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                left: `${50 + Math.cos((hue * Math.PI) / 180) * (saturation / 100) * 50}%`,
                top: `${50 + Math.sin((hue * Math.PI) / 180) * (saturation / 100) * 50}%`
              }}
            ></div>
          </div>
          
          {/* Lightness slider */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lightness: {Math.round(lightness)}%
            </label>
            <div className="h-3 relative w-full rounded-lg overflow-hidden">
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
                className="w-full h-full opacity-0 cursor-pointer relative z-10"
              />
            </div>
          </div>
          
          {/* HSL values */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs opacity-60 dark:text-gray-300">Hue</div>
              <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">{Math.round(hue)}°</div>
            </div>
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs opacity-60 dark:text-gray-300">Saturation</div>
              <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">{Math.round(saturation)}%</div>
            </div>
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs opacity-60 dark:text-gray-300">Lightness</div>
              <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">{Math.round(lightness)}%</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Preset colors tab */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-4 gap-3">
          {colors.map((colorObj) => (
            <button
              key={colorObj.hex}
              onClick={() => setColor(colorObj.hex)}
              className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-105"
              style={{ 
                backgroundColor: colorObj.hex,
                borderColor: colorObj.hex === color ? 'white' : 'transparent'
              }}
              title={colorObj.name}
            ></button>
          ))}
        </div>
      )}
      
      {/* History tab */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-5 gap-2">
          {colorHistory.length > 0 ? (
            colorHistory.map((hex) => (
              <button
                key={hex}
                onClick={() => setColor(hex)}
                className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{ 
                  backgroundColor: hex,
                  borderColor: hex === color ? 'white' : 'transparent'
                }}
                title={hex}
              ></button>
            ))
          ) : (
            <p className="col-span-5 text-center text-gray-500 dark:text-gray-400 py-8">
              No color history yet. Choose some colors to see them here.
            </p>
          )}
        </div>
      )}
      
      {/* Favorites tab */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-5 gap-2">
          {favorites.length > 0 ? (
            favorites.map((hex) => (
              <button
                key={hex}
                onClick={() => setColor(hex)}
                className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{ 
                  backgroundColor: hex,
                  borderColor: hex === color ? 'white' : 'transparent'
                }}
                title={hex}
              ></button>
            ))
          ) : (
            <p className="col-span-5 text-center text-gray-500 dark:text-gray-400 py-8">
              No favorites yet. Use the heart button to save colors you like.
            </p>
          )}
        </div>
      )}
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