import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { AnsiInput } from '@/components/ansi/AnsiInput';
import { TextSegment } from '@/lib/types';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [style, setStyle] = useState(0);
  const [fgColor, setFgColor] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<number | null>(null);
  const [segments, setSegments] = useState<TextSegment[]>([
    { text: "Hello ", style: { fgColor: null, bgColor: null, style: 0 } },
    { text: "World", style: { fgColor: 1, bgColor: null, style: 1 } },
    { text: "", style: { fgColor: null, bgColor: null, style: 0 } }
  ]);

  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const handleSelection = ({ start, end, text }: { start: number, end: number, text: string }) => {
    if (start === end) return;
    
    let currentPos = 0;
    for (const segment of segments) {
      const segmentStart = currentPos;
      const segmentEnd = currentPos + segment.text.length;
      
      if (start >= segmentStart && start < segmentEnd) {
        setStyle(segment.style.style);
        setFgColor(segment.style.fgColor);
        setBgColor(segment.style.bgColor);
        break;
      }
      currentPos += segment.text.length;
    }
  };

  const updateSegmentStyle = (start: number, end: number) => {
    let currentPos = 0;
    let newSegments: TextSegment[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentStart = currentPos;
      const segmentEnd = currentPos + segment.text.length;
      
      // If this segment is within the selection range
      if (segmentStart >= start && segmentEnd <= end) {
        newSegments.push({
          text: segment.text,
          style: {
            fgColor,
            bgColor,
            style
          }
        });
      } else {
        newSegments.push(segment);
      }
      currentPos += segment.text.length;
    }
    
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