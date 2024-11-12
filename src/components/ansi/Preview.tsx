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
    
    if (segment.style.fgColor !== null) {
      if (segment.style.fgColor >= 16) {
        styles.color = indexToRGB(segment.style.fgColor);
      } else {
        const basicColorMap = {
          0: '#000000', 1: '#ff0000', 2: '#00ff00',
          3: '#ffff00', 4: '#0000ff', 5: '#ff00ff',
          6: '#00ffff', 7: '#ffffff', 8: '#808080',
          9: '#ff0000', 10: '#00ff00', 11: '#ffff00',
          12: '#0000ff', 13: '#ff00ff', 14: '#00ffff',
          15: '#ffffff'
        };
        styles.color = basicColorMap[segment.style.fgColor as keyof typeof basicColorMap];
      }
    }
    
    if (segment.style.bgColor !== null) {
      if (segment.style.bgColor >= 16) {
        styles.backgroundColor = indexToRGB(segment.style.bgColor);
      } else {
        const basicColorMap = {
          0: '#000000', 1: '#ff0000', 2: '#00ff00',
          3: '#ffff00', 4: '#0000ff', 5: '#ff00ff',
          6: '#00ffff', 7: '#ffffff', 8: '#808080',
          9: '#ff0000', 10: '#00ff00', 11: '#ffff00',
          12: '#0000ff', 13: '#ff00ff', 14: '#00ffff',
          15: '#ffffff'
        };
        styles.backgroundColor = basicColorMap[segment.style.bgColor as keyof typeof basicColorMap];
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

  const handleSelect = () => {
    const selection = window.getSelection();
    if (!selection || !onSelect || !onStyleUpdate) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer.parentElement;
    if (!container) return;

    let currentPos = 0;
    let selectionStart = -1;
    let selectionEnd = -1;

    // Find the selected segment and position
    const previewDiv = container.closest('[data-preview-container]');
    if (!previewDiv) return;

    const spans = Array.from(previewDiv.getElementsByTagName('span'));
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const spanLength = span.textContent?.length || 0;

      if (selection.containsNode(span, true)) {
        if (selectionStart === -1) {
          selectionStart = currentPos;
        }
        selectionEnd = currentPos + spanLength;
      }
      currentPos += spanLength;
    }

    if (selectionStart !== -1 && selectionEnd !== -1) {
      onSelect({
        start: selectionStart,
        end: selectionEnd,
        text: selection.toString()
      });
      onStyleUpdate(selectionStart, selectionEnd);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div
        className="font-mono text-sm bg-code-background text-code-foreground min-h-[100px] p-3 rounded-md border"
        onMouseUp={handleSelect}
        data-preview-container
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