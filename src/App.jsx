import { useState, useEffect, useRef } from 'react'

function ColorWheel({ onColorSelect, size = 200 }) {
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState({ x: size/2, y: size/2 })

  // Draw the color wheel
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180
      const endAngle = (angle + 1) * Math.PI / 180

      // Create gradient for this slice
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      
      // White at center
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      
      // Pure hue color at this angle
      const hue = angle
      gradient.addColorStop(0.7, `hsl(${hue}, 100%, 50%)`)
      
      // Black at edge
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw indicator
    ctx.beginPath()
    ctx.arc(selectedPoint.x, selectedPoint.y, 8, 0, Math.PI * 2)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = getColorAt(selectedPoint.x, selectedPoint.y)
    ctx.fill()
  }, [size, selectedPoint])

  // Get color at specific point
  const getColorAt = (x, y) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(x, y, 1, 1).data
    return `#${data[0].toString(16).padStart(2,'0')}${data[1].toString(16).padStart(2,'0')}${data[2].toString(16).padStart(2,'0')}`
  }

  // Handle mouse/touch interaction
  const handlePointerDown = (e) => {
    setIsDragging(true)
    handlePointerMove(e)
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Get pointer position relative to canvas
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Constrain to circle
    const centerX = size / 2
      const data = ctx.getImageData(x, y, 1, 1).data
    const radius = size / 2 - 10
    
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    let newX = x
    let newY = y
    
    // If outside circle, constrain to edge
    if (distance > radius) {
      const angle = Math.atan2(dy, dx)
      newX = centerX + Math.cos(angle) * radius
      newY = centerY + Math.sin(angle) * radius
    }
    
    setSelectedPoint({ x: newX, y: newY })
    const color = getColorAt(newX, newY)
    onColorSelect(color)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('pointermove', handlePointerMove)
    
    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointermove', handlePointerMove)
    }
  }, [isDragging])

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      onPointerDown={handlePointerDown}
      className="cursor-pointer touch-none select-none"
    />
  )
}

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

  const handleColorChange = (newColor) => {
    setColor(newColor)
    if (!colorHistory.includes(newColor)) {
      setColorHistory(prev => [newColor, ...prev].slice(0, 5))
    }
  }
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return {r, g, b}
  }
  
  const rgb = color.startsWith('#') ? hexToRgb(color) : {r: 0, g: 0, b: 0}
  const isLight = (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 150
  const complementary = `#${(0xFFFFFF ^ parseInt(color.slice(1), 16)).toString(16).padStart(6, '0')}`

  // Generate color palette variations
  const generateShades = (hex, count = 5) => {
    const { r, g, b } = hexToRgb(hex)
    const shades = []
    
    for (let i = 0; i < count; i++) {
      const factor = 0.8 - (i * 0.15)
      const newR = Math.max(0, Math.min(255, Math.round(r * factor)))
      const newG = Math.max(0, Math.min(255, Math.round(g * factor)))
      const newB = Math.max(0, Math.min(255, Math.round(b * factor)))
      
      const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
      shades.push(newHex)
    }
    
    return shades
  }

  const shades = generateShades(color)

  // Copy color to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Toggle favorite
  const toggleFavorite = () => {
    if (favorites.includes(color)) {
      setFavorites(prev => prev.filter(c => c !== color))
    } else {
      setFavorites(prev => [...prev, color])
    }
  }

  // Dynamic background effects
  const bgStyle = {
    backgroundColor: color,
    backgroundImage: `
      radial-gradient(circle at 30% 20%, ${color}00, ${color} 30%),
      radial-gradient(circle at 70% 60%, ${color}00, ${color} 25%),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E")
    `,
    transition: "background-color 0.8s ease"
  }

  return (
    <div className="w-full h-screen relative overflow-hidden" style={bgStyle}>
      {/* Animated particles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl top-1/4 -left-48 animate-blob"></div>
        <div className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl bottom-1/4 -right-48 animate-blob animation-delay-2000"></div>
      </div>

      {/* Top navigation */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg flex gap-2 items-center" 
              style={{color: isLight ? '#000' : '#fff'}}>
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
              style={{color: isLight ? '#000' : '#fff'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('split')} 
              className={`p-2 rounded-full ${viewMode === 'split' ? 'bg-white/20' : ''} transition-all`}
              style={{color: isLight ? '#000' : '#fff'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="18" rx="1"></rect>
                <rect x="14" y="3" width="7" height="18" rx="1"></rect>
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('palette')} 
              className={`p-2 rounded-full ${viewMode === 'palette' ? 'bg-white/20' : ''} transition-all`}
              style={{color: isLight ? '#000' : '#fff'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>
          </div>
          
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="bg-white/10 backdrop-blur-xl p-2.5 rounded-full shadow-lg hover:bg-white/20 transition-all"
            style={{color: isLight ? '#000' : '#fff'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          
          <button 
            onClick={() => setShowPanel(!showPanel)}
            className="bg-white/10 backdrop-blur-xl p-2.5 rounded-full shadow-lg hover:bg-white/20 transition-all"
            style={{color: isLight ? '#000' : '#fff'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${showPanel ? 'rotate-180' : 'rotate-0'}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Current color display */}
        {viewMode === 'full' && (
          <div className="relative group">
            <div className="text-center transform transition-all mb-6">
              <div className="text-3xl md:text-5xl font-bold mb-2" 
                  style={{color: isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'}}>
                {color}
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => copyToClipboard(color)} 
                  className="text-sm bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full shadow-md transition-all hover:bg-white/20"
                  style={{color: isLight ? '#000' : '#fff'}}>
                  {copied ? 'Copied!' : 'Copy HEX'}
                </button>
                
                <button 
                  onClick={toggleFavorite} 
                  className="text-sm bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full shadow-md transition-all hover:bg-white/20 flex items-center gap-2"
                  style={{color: isLight ? '#000' : '#fff'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={favorites.includes(color) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {favorites.includes(color) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Split view mode */}
        {viewMode === 'split' && (
          <div className="flex w-full h-full">
            <div className="w-1/2 h-full flex flex-col items-center justify-center" style={{backgroundColor: color}}>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{color: isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'}}>
                  {color}
                </p>
                <p className="text-sm mt-2" style={{color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}}>
                  {`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`}
                </p>
              </div>
            </div>
            <div className="w-1/2 h-full flex flex-col items-center justify-center" style={{backgroundColor: complementary}}>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{color: !isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'}}>
                  {complementary}
                </p>
                <p className="text-sm mt-2" style={{color: !isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}}>
                  Complementary
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Palette view mode */}
        {viewMode === 'palette' && (
          <div className="grid grid-cols-5 w-full h-full">
            {shades.map((shade, index) => (
              <div 
                key={index} 
                className="h-full flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                style={{backgroundColor: shade}}
                onClick={() => copyToClipboard(shade)}
              >
                <div className="text-center">
                  <p className="text-lg font-mono" style={{color: index > 2 ? '#fff' : '#000'}}>
                    {shade}
                  </p>
                  <p className="text-xs mt-1 opacity-70" style={{color: index > 2 ? '#fff' : '#000'}}>
                    {index === 0 ? 'Lightest' : index === 4 ? 'Darkest' : `Shade ${index}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Color info card */}
        <div className={`bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-lg transform transition-all duration-500 ease-in-out ${showInfo ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <h2 className="text-xl font-bold mb-3" style={{color: isLight ? '#000' : '#fff'}}>Color Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-70" style={{color: isLight ? '#000' : '#fff'}}>HEX</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold" style={{color: isLight ? '#000' : '#fff'}}>{color}</p>
                <button onClick={() => copyToClipboard(color)} className="opacity-60 hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color: isLight ? '#000' : '#fff'}}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-70" style={{color: isLight ? '#000' : '#fff'}}>RGB</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold" style={{color: isLight ? '#000' : '#fff'}}>
                  {rgb.r}, {rgb.g}, {rgb.b}
                </p>
                <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="opacity-60 hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color: isLight ? '#000' : '#fff'}}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-70" style={{color: isLight ? '#000' : '#fff'}}>HSL</p>
              <p className="font-bold" style={{color: isLight ? '#000' : '#fff'}}>
                Coming soon
              </p>
            </div>
            <div>
              <p className="text-sm opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Complementary</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: complementary}}></div>
                <p className="font-mono font-bold" style={{color: isLight ? '#000' : '#fff'}}>{complementary}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm opacity-70 mb-2" style={{color: isLight ? '#000' : '#fff'}}>Color Harmony</p>
            <div className="flex gap-2">
              {shades.map((shade, index) => (
                <div 
                  key={index} 
                  className="w-8 h-8 rounded-lg shadow-md border border-white/10 cursor-pointer hover:scale-110 transition-transform" 
                  style={{backgroundColor: shade}}
                  onClick={() => handleColorChange(shade)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom panel */}
      <div className={`fixed transition-all duration-500 ease-in-out ${showPanel ? 'bottom-8' : '-bottom-full'} inset-x-0 px-4 z-30`}>
        <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/10">
          {/* Tabs */}
          <div className="flex mb-6 bg-white/5 rounded-full p-1">
            <button 
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'colors' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`} 
              style={{color: isLight ? '#000' : '#fff'}}>
              Colors
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`}
              style={{color: isLight ? '#000' : '#fff'}}>
              Saved
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-white/10' : 'opacity-70 hover:opacity-100'}`}
              style={{color: isLight ? '#000' : '#fff'}}>
              Custom
            </button>
          </div>
          
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <>
              {/* History section */}
              {colorHistory.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Recent</h3>
                  <div className="flex gap-2 flex-wrap">
                    {colorHistory.map((historyColor) => (
                      <button 
                        key={historyColor}
                        onClick={() => setColor(historyColor)}
                        className={`w-10 h-10 rounded-lg shadow-lg transition-all hover:scale-110 active:scale-95 ${color === historyColor ? 'ring-2 ring-white' : ''}`}
                        style={{backgroundColor: historyColor}}
                        aria-label={historyColor}
                      >
                        {color === historyColor && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto" style={{color: hexToRgb(historyColor).r*0.299 + hexToRgb(historyColor).g*0.587 + hexToRgb(historyColor).b*0.114 > 150 ? '#000' : '#fff'}}>
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
                <h3 className="text-sm font-medium mb-3 opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Presets</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((colorObj) => (
                    <button 
                      key={colorObj.hex}
                      onClick={() => handleColorChange(colorObj.hex)}
                      className={`outline-none px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${color === colorObj.hex ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-transparent' : ''}`}
                      style={{backgroundColor: colorObj.hex, color: colorObj.textColor}}
                    >
                      {colorObj.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom color input */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Custom Color</h3>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span style={{color: isLight ? '#000' : '#fff'}}>#</span>
                    </div>
                    <input 
                      type="text" 
                      value={color.replace('#', '')}
                      onChange={(e) => handleColorChange(`#${e.target.value}`)}
                      className="w-full bg-white/20 backdrop-blur-md pl-7 pr-4 py-2 rounded-full outline-none font-mono"
                      style={{color: isLight ? '#000' : '#fff'}}
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
              <h3 className="text-sm font-medium mb-3 opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Saved Colors</h3>
              <div className="flex gap-2 flex-wrap">
                {favorites.map((favoriteColor) => (
                  <button 
                    key={favoriteColor}
                    onClick={() => setColor(favoriteColor)}
                    className={`w-10 h-10 rounded-lg shadow-lg transition-all hover:scale-110 active:scale-95 ${color === favoriteColor ? 'ring-2 ring-white' : ''}`}
                    style={{backgroundColor: favoriteColor}}
                    aria-label={favoriteColor}
                  >
                    {color === favoriteColor && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto" style={{color: hexToRgb(favoriteColor).r*0.299 + hexToRgb(favoriteColor).g*0.587 + hexToRgb(favoriteColor).b*0.114 > 150 ? '#000' : '#fff'}}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tab */}
          {activeTab === 'custom' && (
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-3 opacity-70" style={{color: isLight ? '#000' : '#fff'}}>Custom Color Picker</h3>
              <ColorWheel onColorSelect={handleColorChange} size={200} />
            </div>
          )}
        </div>
      </div>
      
      {/* Notification toast */}
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-sm font-medium" style={{color: isLight ? '#000' : '#fff'}}>
          Copied to clipboard!
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default App
