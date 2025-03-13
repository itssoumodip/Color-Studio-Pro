import { useState } from 'react'
import ColorWheel from './ColorWheel'
import { getContrastColor, hexToRgb } from '../utils/colorUtils'

export default function ColorPanel({ 
  showPanel, color, handleColorChange, colors, colorHistory, 
  favorites, setColor, activeTab, setActiveTab
}) {
  const textColor = getContrastColor(color)
  
  return (
    <div className={`fixed transition-all duration-500 ease-in-out ${showPanel ? 'bottom-8' : '-bottom-full'} inset-x-0 px-4 z-30`}>
      <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/10">
        {/* Tabs */}
        <div className="flex mb-6 bg-white/5 rounded-full p-1">
          <button 
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'colors' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`} 
            style={{ color: textColor }}>
            Colors
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`}
            style={{ color: textColor }}>
            Saved
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`}
            style={{ color: textColor }}>
            Custom
          </button>
        </div>
        
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <>
            {/* History section */}
            {colorHistory.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>Recent</h3>
                <div className="flex gap-2 flex-wrap">
                  {colorHistory.map((historyColor) => (
                    <button 
                      key={historyColor}
                      onClick={() => setColor(historyColor)}
                      className={`w-10 h-10 rounded-lg shadow-lg transition-all hover:scale-110 active:scale-95 ${color === historyColor ? 'ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: historyColor }}
                      aria-label={historyColor}
                    >
                      {color === historyColor && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={getContrastColor(historyColor)} strokeWidth="2" className="mx-auto">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color presets */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>Presets</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((colorObj) => (
                  <button 
                    key={colorObj.hex}
                    onClick={() => handleColorChange(colorObj.hex)}
                    className={`outline-none px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${color === colorObj.hex ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-transparent' : ''}`}
                    style={{ 
                      backgroundColor: colorObj.hex, 
                      color: getContrastColor(colorObj.hex)
                    }}
                  >
                    {colorObj.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom color input */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium opacity-70" style={{ color: textColor }}>Custom Color</h3>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span style={{ color: textColor }}>#</span>
                  </div>
                  <input 
                    type="text" 
                    value={color.replace('#', '')}
                    onChange={(e) => handleColorChange(`#${e.target.value}`)}
                    className="w-full bg-white/20 backdrop-blur-md pl-7 pr-4 py-2 rounded-full outline-none font-mono"
                    style={{ color: textColor }}
                    placeholder="RRGGBB"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-white/30 group">
                  <input 
                    type="color" 
                    value={color.startsWith('#') ? color : '#000000'} 
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 cursor-pointer"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>Saved Colors</h3>
            {favorites.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {favorites.map((favoriteColor) => (
                  <button 
                    key={favoriteColor}
                    onClick={() => setColor(favoriteColor)}
                    className={`w-10 h-10 rounded-lg shadow-lg transition-all hover:scale-110 active:scale-95 ${color === favoriteColor ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: favoriteColor }}
                    aria-label={favoriteColor}
                  >
                    {color === favoriteColor && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={getContrastColor(favoriteColor)} strokeWidth="2" className="mx-auto">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center opacity-70" style={{ color: textColor }}>
                No saved colors yet. Click the heart icon to save colors.
              </p>
            )}
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>Color Wheel</h3>
            <div className="flex justify-center mb-4">
              <ColorWheel color={color} onChange={handleColorChange} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}