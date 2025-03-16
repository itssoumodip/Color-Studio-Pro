import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ColorWheel = ({ color, onChange }) => {
  const wheelRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || isDrawn) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 5;

    ctx.clearRect(0, 0, width, height);

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius) continue;

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const hue = (angle + 360) % 360;
        const saturation = distance / radius;

      
        const { r, g, b } = hslToRgb(hue, saturation, 0.5);

        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255; 
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsDrawn(true);
  }, [isDrawn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    const preventDefaultTouch = (e) => {
      e.preventDefault();
    };
    
    if (canvas) {
      canvas.addEventListener('touchstart', preventDefaultTouch, { passive: false });
      canvas.addEventListener('touchmove', preventDefaultTouch, { passive: false });
      canvas.addEventListener('touchend', preventDefaultTouch, { passive: false });
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', preventDefaultTouch);
        canvas.removeEventListener('touchmove', preventDefaultTouch);
        canvas.removeEventListener('touchend', preventDefaultTouch);
      }
    };
  }, []);

  const handleInteraction = (e) => {
    if (!wheelRef.current) return;
    e.preventDefault(); 

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const offsetX = x - centerX;
    const offsetY = y - centerY;

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const maxDistance = Math.min(centerX, centerY);
    const angle = Math.atan2(offsetY, offsetX) * 180 / Math.PI;

    const clampedDistance = Math.min(distance, maxDistance);
    
    const hue = (angle + 360) % 360;
    const saturation = Math.min(clampedDistance / maxDistance, 1);

    const hex = hslToHex(hue, saturation, 0.5);

    onChange(hex);

    setIndicatorPosition({
      x: offsetX,
      y: offsetY
    });
  };

  const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
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
      g = hue2rgb(p, q, (h / 360) % 1);
      b = hue2rgb(p, q, (h / 360 - 1/3) % 1);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const hslToHex = (h, s, l) => {
    const { r, g, b } = hslToRgb(h, s, l);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const toHex = (x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return (
    <motion.div 
      ref={wheelRef}
      className="relative w-64 h-64 rounded-full overflow-hidden cursor-pointer shadow-lg"
      whileHover={{ scale: 1.02 }}
      onMouseDown={handleInteraction}
      onMouseMove={(e) => e.buttons === 1 && handleInteraction(e)}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
    >
      <canvas 
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full"
      />
      <div 
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{ 
          transform: indicatorPosition.x ? 
            `translate(calc(${indicatorPosition.x}px - 50%), calc(${indicatorPosition.y}px - 50%))` : 
            'translate(-50%, -50%)',
          backgroundColor: color
        }}
      />
    </motion.div>
  );
};

export default ColorWheel;