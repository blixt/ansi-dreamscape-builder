import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { AnsiInput } from '@/components/ansi/AnsiInput';
import { TextSegment } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [style, setStyle] = useState(0);
  const [fgColor, setFgColor] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<number | null>(null);
  const [segments, setSegments] = useState<TextSegment[]>([
    { text: "Hello ", style: { fgColor: null, bgColor: null, style: 0 } },
    { text: "World", style: { fgColor: 1, bgColor: null, style: 1 } },
    { text: "", style: { fgColor: null, bgColor: null, style: 0 } }
  ]);
  const [currentSelection, setCurrentSelection] = useState<{ start: number, end: number } | null>(null);

  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const handleSelection = (selection: { start: number, end: number, text: string } | null) => {
    if (!selection) {
      setCurrentSelection(null);
      return;
    }
    
    setCurrentSelection({ start: selection.start, end: selection.end });
  };

  useEffect(() => {
    if (currentSelection) {
      updateSegmentStyle(currentSelection.start, currentSelection.end);
    }
  }, [fgColor, bgColor, style]);

  const optimizeSegments = (segments: TextSegment[]): TextSegment[] => {
    return segments.reduce((acc: TextSegment[], curr: TextSegment) => {
      if (acc.length === 0) return [curr];
      
      const last = acc[acc.length - 1];
      const canMerge = last.style.style === curr.style.style &&
                      last.style.fgColor === curr.style.fgColor &&
                      last.style.bgColor === curr.style.bgColor;
      
      if (canMerge) {
        acc[acc.length - 1] = {
          text: last.text + curr.text,
          style: last.style
        };
      } else {
        acc.push(curr);
      }
      
      return acc;
    }, []);
  };

  const updateSegmentStyle = (start: number, end: number) => {
    let currentPos = 0;
    let newSegments: TextSegment[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentStart = currentPos;
      const segmentEnd = currentPos + segment.text.length;
      
      // Selection completely outside this segment
      if (end <= segmentStart || start >= segmentEnd) {
        newSegments.push(segment);
      }
      // Selection overlaps with this segment
      else {
        // Part 1: Text before selection in this segment
        if (start > segmentStart) {
          const beforeText = segment.text.substring(0, start - segmentStart);
          if (beforeText) {
            newSegments.push({
              text: beforeText,
              style: { ...segment.style }
            });
          }
        }

        // Part 2: Selected text in this segment
        const selectionStartInSegment = Math.max(0, start - segmentStart);
        const selectionEndInSegment = Math.min(segment.text.length, end - segmentStart);
        const selectedText = segment.text.substring(selectionStartInSegment, selectionEndInSegment);
        
        if (selectedText) {
          const newStyle = {
            // Preserve existing style if we're only changing colors
            style: style === 0 ? segment.style.style : style,
            // Only update colors if they're explicitly set
            fgColor: fgColor !== null ? fgColor : segment.style.fgColor,
            bgColor: bgColor !== null ? bgColor : segment.style.bgColor
          };

          newSegments.push({
            text: selectedText,
            style: newStyle
          });
        }

        // Part 3: Text after selection in this segment
        const afterText = segment.text.substring(selectionEndInSegment);
        if (afterText) {
          newSegments.push({
            text: afterText,
            style: { ...segment.style }
          });
        }
      }
      
      currentPos += segment.text.length;
    }
    
    // Filter out empty segments and optimize
    newSegments = optimizeSegments(newSegments.filter(segment => segment.text.length > 0));
    setSegments(newSegments);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">ANSI Code Visualizer</h1>
            <ThemeToggle />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StyleSelector style={style} setStyle={setStyle} />
              <ColorPicker
                fg={fgColor ?? 0}
                setFg={setFgColor}
                bg={bgColor ?? 0}
                setBg={setBgColor}
                fgColor={fgColor}
                setFgColor={setFgColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
              />
            </div>

            <div className="space-y-6">
              <AnsiInput 
                segments={segments}
                setSegments={setSegments}
              />
              <Preview 
                segments={segments}
                onSelect={handleSelection}
                onStyleUpdate={updateSegmentStyle}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;