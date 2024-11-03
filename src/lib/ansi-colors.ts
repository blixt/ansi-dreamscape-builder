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
      '#000000', '#ff3333', '#33ff33', '#ffff33',
      '#3333ff', '#ff33ff', '#33ffff', '#c0c0c0',
      '#808080', '#ff0000', '#00ff00', '#ffff00',
      '#0000ff', '#ff00ff', '#00ffff', '#ffffff'
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