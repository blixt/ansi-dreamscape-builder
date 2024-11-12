import { parseAnsiCode } from '@/lib/ansi-parser';
import { indexToRGB } from '@/lib/ansi-colors';
import { Textarea } from "@/components/ui/textarea";

interface PreviewProps {
  ansiCode: string;
  onSelect?: (selection: { start: number, end: number }) => void;
}

interface TextSegment {
  text: string;
  style: React.CSSProperties;
}

export function Preview({ ansiCode, onSelect }: PreviewProps) {
  const getStyleForCode = (code: string): React.CSSProperties => {
    const parsed = parseAnsiCode(code);
    const styles: React.CSSProperties = {};
    
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

  const parseTextIntoSegments = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    const regex = /\x1b\[[0-9;]*m|\\\e\[[0-9;]*m/g;
    let currentStyle: React.CSSProperties = {};
    let lastIndex = 0;
    let match;

    // Convert \e to actual escape character for processing
    text = text.replace(/\\e/g, '\x1b');

    while ((match = regex.exec(text)) !== null) {
      // Add text segment before the ANSI code if it exists
      if (match.index > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.index),
          style: { ...currentStyle }
        });
      }

      // Update current style based on the ANSI code
      currentStyle = getStyleForCode(match[0]);
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text with current style
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        style: { ...currentStyle }
      });
    }

    return segments;
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && onSelect) {
      // Calculate selection positions based on text content
      const start = selection.anchorOffset;
      const end = selection.focusOffset;
      onSelect({ start, end });
    }
  };

  const segments = parseTextIntoSegments(ansiCode);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div
        className="font-mono text-sm bg-code-background text-code-foreground min-h-[100px] p-3 rounded-md border"
        onSelect={handleSelect}
      >
        {segments.map((segment, index) => (
          <span key={index} style={segment.style}>
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}