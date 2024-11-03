import { parseAnsiCode } from '@/lib/ansi-parser';
import { indexToRGB } from '@/lib/ansi-colors';

interface PreviewProps {
  ansiCode: string;
}

export function Preview({ ansiCode }: PreviewProps) {
  const getPreviewStyle = () => {
    const parsed = parseAnsiCode(ansiCode);
    const styles: Record<string, any> = {};
    
    if (parsed.use256Color) {
      if (parsed.fg256 !== null) styles.color = indexToRGB(parsed.fg256);
      if (parsed.bg256 !== null) styles.backgroundColor = indexToRGB(parsed.bg256);
    } else {
      const basicColorMap = {
        30: '#000000', 31: '#ff0000', 32: '#00ff00',
        33: '#ffff00', 34: '#0000ff', 35: '#ff00ff',
        36: '#00ffff', 37: '#ffffff'
      };
      
      if (parsed.fgColor !== null) styles.color = basicColorMap[parsed.fgColor as keyof typeof basicColorMap];
      if (parsed.bgColor !== null) {
        styles.backgroundColor = basicColorMap[(parsed.bgColor + 30) as keyof typeof basicColorMap];
      }
    }
    
    if (parsed.style === 1) styles.fontWeight = 'bold';
    if (parsed.style === 2) styles.opacity = 0.5;
    if (parsed.style === 3) styles.fontStyle = 'italic';
    if (parsed.style === 4) styles.textDecoration = 'underline';
    if (parsed.style === 5) styles.animation = 'blink 1s step-end infinite';
    if (parsed.style === 7) {
      const temp = styles.color;
      styles.color = styles.backgroundColor;
      styles.backgroundColor = temp;
    }
    if (parsed.style === 9) styles.textDecoration = 'line-through';
    
    return styles;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div 
        className="w-full p-4 rounded bg-code-background font-mono text-sm"
        style={getPreviewStyle()}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
}
