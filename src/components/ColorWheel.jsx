import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ColorWheel({ color, onChange }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [wheelSize, setWheelSize] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const radius = wheelSize / 2;
  const [colorMarker, setColorMarker] = useState({ x: 0, y: 0, visible: false });
  
  // Resize wheel on window resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const parent = wrapperRef.current.parentElement;
        if (parent) {
          const size = Math.min(parent.clientWidth, parent.clientHeight) * 0.9;
          setWheelSize(Math.max(size, 200)); // Set a minimum size
        }
      }
    };
    
    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw color wheel and update marker position
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas size explicitly
    canvas.width = wheelSize;
    canvas.height = wheelSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, wheelSize, wheelSize);
    
    // Draw color wheel with smoother gradient
    const centerX = radius;
    const centerY = radius;

    // Draw outer color wheel (hue)
    for (let angle = 0; angle < 360; angle += 0.5) {
      const startAngle = (angle - 0.5) * Math.PI / 180;
      const endAngle = (angle + 0.5) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 1, startAngle, endAngle);
      ctx.closePath();
      
      const hue = angle;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fill();
    }
    
    // Create saturation gradient (white to transparent)
    const saturationGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius - 1
    );
    saturationGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    saturationGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    saturationGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    saturationGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = saturationGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw concentric circles for reference
    for (let r = radius * 0.33; r < radius; r += radius * 0.33) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Update color marker position based on the current color
    updateColorMarker(color);
    
  }, [wheelSize, color]);
  
  // Update color marker position from hex color
  const updateColorMarker = (hexColor) => {
    try {
      const rgb = hexToRgb(hexColor);
      // Convert RGB to HSL to find position on wheel
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // Calculate marker position
      if (hsl.s > 0) {
        const angle = hsl.h * Math.PI / 180;
        const distance = hsl.s * (radius - 5); // Adjust for marker size
        
        const x = radius + Math.cos(angle) * distance;
        const y = radius + Math.sin(angle) * distance;
        
        setColorMarker({ x, y, visible: true });
      } else {
        // For grayscale colors, place marker in center
        setColorMarker({ x: radius, y: radius, visible: true });
      }
    } catch (error) {
      console.error("Error updating color marker:", error);
      setColorMarker({ x: radius, y: radius, visible: false });
    }
  };
  
  // Handle mouse and touch interactions
  const handleInteraction = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse/touch position
    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate position relative to canvas
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Calculate distance from center
    const dx = x - radius;
    const dy = y - radius;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only process if inside the wheel
    if (distance <= radius) {
      // Calculate angle (hue)
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      
      // Calculate saturation (normalized distance from center)
      const saturation = Math.min(distance / (radius - 5), 1);
      
      // Default to 50% lightness for a vibrant color wheel
      const lightness = 0.5;
      
      // Convert HSL to RGB
      const rgb = hslToRgb(angle, saturation, lightness);
      
      // Convert RGB to HEX
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      
      // Update the marker position
      setColorMarker({ x, y, visible: true });
      
      // Call the onChange handler with the new color
      onChange(hex);
    }
  };
  
  // Event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e);
    
    // Add event listeners for drag
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      handleInteraction(e);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e);
  };
  
  const handleTouchMove = (e) => {
    if (isDragging) {
      handleInteraction(e);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div 
      ref={wrapperRef} 
      className="relative flex items-center justify-center"
    >
      <canvas 
        ref={canvasRef} 
        width={wheelSize} 
        height={wheelSize} 
        className={`rounded-full shadow-lg cursor-pointer ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleInteraction}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {colorMarker.visible && (
        <motion.div 
          className="absolute pointer-events-none w-6 h-6 rounded-full border-2 border-white shadow-lg z-10"
          style={{ 
            backgroundColor: color,
            left: colorMarker.x,
            top: colorMarker.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: 1,
            boxShadow: isDragging 
              ? '0 0 0 4px rgba(255,255,255,0.3)' 
              : '0 0 0 2px rgba(255,255,255,0.2)'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0 2px rgba(255,255,255,0.7)', 
                '0 0 0 4px rgba(255,255,255,0.3)', 
                '0 0 0 2px rgba(255,255,255,0.7)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
      
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
    </div>
  );
}

// Helper functions for color conversion
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Convert shorthand hex to full form
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
      default: h = 0;
    }
    
    h *= 60;
  }
  
  return { h, s, l };
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
    
    r = hue2rgb(p, q, (h / 360 + 1/3) % 1);
    g = hue2rgb(p, q, h / 360 % 1);
    b = hue2rgb(p, q, (h / 360 - 1/3 + 1) % 1);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}