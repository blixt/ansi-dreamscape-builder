export const styles = {
  0: { name: 'Normal', code: '0' },
  1: { name: 'Bold', code: '1' },
  2: { name: 'Dim', code: '2' },
  3: { name: 'Italic', code: '3' },
  4: { name: 'Underline', code: '4' },
  5: { name: 'Blink', code: '5' },
  7: { name: 'Reverse', code: '7' },
  8: { name: 'Hidden', code: '8' },
  9: { name: 'Strike', code: '9' }
} as const;

export const basicColors = {
  30: 'Black',
  31: 'Red',
  32: 'Green',
  33: 'Yellow',
  34: 'Blue',
  35: 'Magenta',
  36: 'Cyan',
  37: 'White'
} as const;

export const indexToRGB = (index: number): string => {
  if (index < 16) {
    const basic = [
      '#000000', // Black
      '#cd0000', // Red
      '#00cd00', // Green
      '#cdcd00', // Yellow
      '#0000ee', // Blue
      '#cd00cd', // Magenta
      '#00cdcd', // Cyan
      '#e5e5e5', // White
      '#7f7f7f', // Gray (Bright Black)
      '#ff0000', // Bright Red
      '#00ff00', // Bright Green
      '#ffff00', // Bright Yellow
      '#5c5cff', // Bright Blue
      '#ff00ff', // Bright Magenta
      '#00ffff', // Bright Cyan
      '#ffffff'  // Bright White
    ];
    return basic[index];
  }
  
  if (index >= 232) {
    const gray = (index - 232) * 10 + 8;
    return `rgb(${gray},${gray},${gray})`;
  }
  
  index -= 16;
  const r = Math.floor(index / 36) * 51;
  const g = Math.floor((index % 36) / 6) * 51;
  const b = (index % 6) * 51;
  return `rgb(${r},${g},${b})`;
};