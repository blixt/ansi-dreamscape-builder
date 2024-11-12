export interface AnsiParseResult {
  style: number;
  fgColor: number | null;
  bgColor: number | null;
  customCode: string;
}

export const parseAnsiCode = (code: string, previousResult?: AnsiParseResult): AnsiParseResult => {
  // Remove escape sequence prefix and suffix if present
  code = code.replace(/^\x1b\[/, '').replace(/m$/, '');
  
  const parts = code.split(';').map(Number);
  
  const result: AnsiParseResult = {
    style: previousResult?.style ?? 0,
    fgColor: previousResult?.fgColor ?? null,
    bgColor: previousResult?.bgColor ?? null,
    customCode: '',
  };

  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    
    // Reset
    if (part === 0) {
      result.style = 0;
      result.fgColor = null;
      result.bgColor = null;
    }
    // Style
    else if (part >= 1 && part <= 9) {
      result.style = part;
    }
    // 256 color
    else if (part === 38 && parts[i + 1] === 5 && parts[i + 2] !== undefined) {
      result.fgColor = parts[i + 2];
      i += 2;
    }
    else if (part === 48 && parts[i + 1] === 5 && parts[i + 2] !== undefined) {
      result.bgColor = parts[i + 2];
      i += 2;
    }
    // Basic colors
    else if (part >= 30 && part <= 37) {
      result.fgColor = part - 30;
    }
    else if (part >= 40 && part <= 47) {
      result.bgColor = part - 40;
    }
    // Custom code
    else if (!isNaN(part)) {
      result.customCode = part.toString();
    }
    
    i++;
  }

  return result;
};