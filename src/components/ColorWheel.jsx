import { useRef, useEffect } from 'react';
import { hexToRgb } from '../utils/colorUtils';

export default function ColorWheel({ color, onChange }) {
  const canvasRef = useRef(null);
  const wheelSize = 200;
  const radius = wheelSize / 2;
  
  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, wheelSize, wheelSize);
    
    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.closePath();
      
      const hue = angle;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fill();
    }
    
    // Draw inner white to black gradient
    const innerRadius = radius * 0.7;
    for (let r = 0; r <= innerRadius; r++) {
      const gradientPosition = r / innerRadius;
      const brightness = 100 - gradientPosition * 100; // 100% to 0%
      
      ctx.beginPath();
      ctx.arc(radius, radius, innerRadius - r, 0, 2 * Math.PI);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsl(0, 0%, ${brightness}%)`;
      ctx.stroke();
    }
    
    // Draw color marker
    const { r, g, b } = hexToRgb(color);
    // Convert RGB to HSL to find position on wheel
    const hsl = rgbToHsl(r, g, b);
    
    // Draw marker at position
    if (hsl.s > 0) {
      const angle = hsl.h * Math.PI / 180;
      const distance = hsl.s * radius;
      
      const x = radius + Math.cos(angle) * distance;
      const y = radius + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }
    
  }, [color]);
  
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate distance from center
    const dx = x - radius;
    const dy = y - radius;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= radius) {
      // Calculate angle (hue)
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      
      // Calculate saturation
      const saturation = distance / radius;
      
      // Calculate lightness based on distance from center
      let lightness = 0.5;
      if (distance < radius * 0.7) {
        // Inside the inner circle
        lightness = 0.5 * (1 - distance / (radius * 0.7));
      }
      
      // Convert HSL to RGB
      const rgb = hslToRgb(angle, saturation, lightness);
      
      // Convert RGB to HEX
      const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
      
      onChange(hex);
    }
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={wheelSize} 
      height={wheelSize} 
      className="cursor-pointer rounded-full shadow-lg"
      onClick={handleClick}
    />
  );
}

// Helper functions
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
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360 - 1/3) % 1);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}