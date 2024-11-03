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