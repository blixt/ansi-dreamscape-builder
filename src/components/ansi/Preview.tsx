import { TextSegment } from '@/lib/types';
import { indexToRGB } from '@/lib/ansi-colors';

interface PreviewProps {
  segments: TextSegment[];
  onSelect?: (selection: { start: number, end: number, text: string }) => void;
  onStyleUpdate?: (start: number, end: number) => void;
}

export function Preview({ segments, onSelect, onStyleUpdate }: PreviewProps) {
  const getStyleForSegment = (segment: TextSegment): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    if (segment.style.use256Color) {
      if (segment.style.fg256 !== null) styles.color = indexToRGB(segment.style.fg256);
      if (segment.style.bg256 !== null) styles.backgroundColor = indexToRGB(segment.style.bg256);
    } else {
      const basicColorMap = {
        30: '#000000', 31: '#ff0000', 32: '#00ff00',
        33: '#ffff00', 34: '#0000ff', 35: '#ff00ff',
        36: '#00ffff', 37: '#ffffff'
      };
      
      if (segment.style.fgColor !== null) styles.color = basicColorMap[segment.style.fgColor as keyof typeof basicColorMap];
      if (segment.style.bgColor !== null) {
        styles.backgroundColor = basicColorMap[(segment.style.bgColor + 30) as keyof typeof basicColorMap];
      }
    }
    
    if (segment.style.style === 1) styles.fontWeight = 'bold';
    if (segment.style.style === 2) styles.opacity = 0.5;
    if (segment.style.style === 3) styles.fontStyle = 'italic';
    if (segment.style.style === 4) styles.textDecoration = 'underline';
    if (segment.style.style === 5) styles.animation = 'blink 1s step-end infinite';
    if (segment.style.style === 7) {
      const temp = styles.color;
      styles.color = styles.backgroundColor;
      styles.backgroundColor = temp;
    }
    if (segment.style.style === 9) styles.textDecoration = 'line-through';
    
    return styles;
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && onSelect) {
      const start = selection.anchorOffset;
      const end = selection.focusOffset;
      const text = selection.toString();
      onSelect({ start, end, text });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div
        className="font-mono text-sm bg-code-background text-code-foreground min-h-[100px] p-3 rounded-md border"
        onSelect={handleSelect}
      >
        {segments.map((segment, index) => (
          <span key={index} style={getStyleForSegment(segment)}>
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}