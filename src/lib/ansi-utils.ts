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
      '#000000', '#ff3333', '#33ff33', '#ffff33', // Brighter red, green, yellow
      '#3333ff', '#ff33ff', '#33ffff', '#c0c0c0', // Brighter blue, magenta, cyan
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

export interface AnsiParseResult {
  style: number;
  fgColor: number | null;
  bgColor: number | null;
  fg256: number | null;
  bg256: number | null;
  use256Color: boolean;
  customCode: string;
}

export const parseAnsiCode = (code: string): AnsiParseResult => {
  // Remove escape sequence prefix and suffix if present
  code = code.replace(/^\x1b\[/, '').replace(/m$/, '');
  
  const parts = code.split(';').map(Number);
  
  const result: AnsiParseResult = {
    style: 0,
    fgColor: null,
    bgColor: null,
    fg256: null,
    bg256: null,
    use256Color: false,
    customCode: '',
  };

  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    
    // Style
    if (part >= 0 && part <= 9) {
      result.style = part;
    }
    // 256 color
    else if (part === 38 && parts[i + 1] === 5 && parts[i + 2] !== undefined) {
      result.use256Color = true;
      result.fg256 = parts[i + 2];
      result.fgColor = null;
      i += 2;
    }
    else if (part === 48 && parts[i + 1] === 5 && parts[i + 2] !== undefined) {
      result.use256Color = true;
      result.bg256 = parts[i + 2];
      result.bgColor = null;
      i += 2;
    }
    // Basic colors
    else if (part >= 30 && part <= 37) {
      result.fgColor = part;
      result.use256Color = false;
    }
    else if (part >= 40 && part <= 47) {
      result.bgColor = part - 40;
      result.use256Color = false;
    }
    // Custom code
    else if (!isNaN(part)) {
      result.customCode = part.toString();
    }
    
    i++;
  }

  return result;
};