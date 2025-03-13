/**
 * Converts hex color to RGB
 */
export const hexToRgb = (hex) => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle invalid hex
  if (!/^[0-9A-Fa-f]{6}$/i.test(cleanHex)) {
    return { r: 0, g: 0, b: 0 };
  }
  
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Get WCAG 2.0 AA compliant contrast color (white or black)
 * Based on relative luminance calculation for better accessibility
 */
export const getContrastColor = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  
  // Calculate relative luminance following WCAG 2.0 formula
  const sRGB = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 
      ? val / 12.92 
      : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  
  // Use threshold of 0.179 for WCAG AA compliance
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
};

/**
 * Generate shades of a color
 */
export const generateShades = (hex, count = 5) => {
  const { r, g, b } = hexToRgb(hex);
  const shades = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate shade percentage (0% to 100%)
    const percent = i / (count - 1);
    
    // Mix with white or black based on percent
    const newR = Math.round(r * (1 - percent) + 255 * percent);
    const newG = Math.round(g * (1 - percent) + 255 * percent);
    const newB = Math.round(b * (1 - percent) + 255 * percent);
    
    // Convert back to hex
    const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    shades.push(newHex);
  }
  
  return shades;
};

/**
 * Generate complementary color
 */
export const getComplementaryColor = (hex) => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle invalid hex
  if (!/^[0-9A-Fa-f]{6}$/i.test(cleanHex)) {
    return '#000000';
  }
  
  // Calculate complementary (opposite on color wheel)
  const rgbHex = parseInt(cleanHex, 16);
  const complementary = 0xFFFFFF ^ rgbHex;
  
  return `#${complementary.toString(16).padStart(6, '0')}`;
};