import { getContrastColor, getComplementaryColor, hexToRgb } from '../utils/colorUtils'

export default function ColorInfo({ color, showInfo, copyToClipboard }) {
  const textColor = getContrastColor(color)
  const complementary = getComplementaryColor(color)
  const rgb = hexToRgb(color)
  const shades = generateShades(color)
  
  return (
    <div className={`bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-lg transform transition-all duration-500 ease-in-out ${showInfo ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
      <h2 className="text-xl font-bold mb-3" style={{ color: textColor }}>Color Details</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>HEX</p>
          <div className="flex items-center gap-2">
            <p className="font-mono font-bold" style={{ color: textColor }}>{color}</p>
            <button onClick={() => copyToClipboard(color)} className="opacity-60 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>RGB</p>
          <div className="flex items-center gap-2">
            <p className="font-mono font-bold" style={{ color: textColor }}>
              {rgb.r}, {rgb.g}, {rgb.b}
            </p>
            <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="opacity-60 hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>HSL</p>
          <p className="font-bold" style={{ color: textColor }}>
            Coming soon
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70" style={{ color: textColor }}>Complementary</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: complementary }}></div>
            <p className="font-mono font-bold" style={{ color: textColor }}>{complementary}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm opacity-70 mb-2" style={{ color: textColor }}>Color Harmony</p>
        <div className="flex gap-2">
          {shades.map((shade, index) => (
            <div 
              key={index} 
              className="w-8 h-8 rounded-lg shadow-md border border-white/10 cursor-pointer hover:scale-110 transition-transform" 
              style={{ backgroundColor: shade }}
              onClick={() => handleColorChange(shade)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function generateShades(hex, count = 5) {
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