import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ColorWheel = ({ color, onChange }) => {
  const wheelRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 0 });

  // Draw the color wheel once on mount
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

    // Create an image data object
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // More efficient drawing approach
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Get position relative to center
        const dx = x - centerX;
        const dy = y - centerY;

        // Calculate distance from center and angle
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Skip pixels outside the wheel
        if (distance > radius) continue;

        // Calculate angle (hue) and normalize distance (saturation)
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const hue = (angle + 360) % 360;
        const saturation = distance / radius;

        // Convert HSL to RGB
        const { r, g, b } = hslToRgb(hue, saturation, 0.5);

        // Set pixel data
        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255; // Alpha channel (fully opaque)
      }
    }

    // Draw the image data to canvas
    ctx.putImageData(imageData, 0, 0);
    setIsDrawn(true);
  }, [isDrawn]);

  // Event handler for both mouse and touch interactions
  const handleInteraction = (e) => {
    if (!wheelRef.current) return;
    e.preventDefault(); // Prevent scrolling on touch devices

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Get cursor/touch position
    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate position relative to center of wheel
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Calculate offset from center
    const offsetX = x - centerX;
    const offsetY = y - centerY;

    // Calculate polar coordinates
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const maxDistance = Math.min(centerX, centerY);
    const angle = Math.atan2(offsetY, offsetX) * 180 / Math.PI;

    // Clamp distance to wheel radius
    const clampedDistance = Math.min(distance, maxDistance);
    
    // Convert to HSL
    const hue = (angle + 360) % 360;
    const saturation = Math.min(clampedDistance / maxDistance, 1);

    // Convert HSL to hex
    const hex = hslToHex(hue, saturation, 0.5);

    // Send color to parent
    onChange(hex);

    // Update indicator position
    setIndicatorPosition({
      x: offsetX,
      y: offsetY
    });
  };

  // Helper function to convert HSL to RGB
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

  // Helper function to convert HSL to hex
  const hslToHex = (h, s, l) => {
    const { r, g, b } = hslToRgb(h, s, l);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Helper function to convert decimal to hex
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