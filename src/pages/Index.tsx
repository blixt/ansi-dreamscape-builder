import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { parseAnsiCode } from '@/lib/ansi-parser';
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
  const [fg256, setFg256] = useState(1);
  const [bg256, setBg256] = useState(1);
  const [use256Color, setUse256Color] = useState(false);
  const [segments, setSegments] = useState<TextSegment[]>([
    { text: "Hello ", style: { fgColor: null, bgColor: null, fg256: null, bg256: null, use256Color: false, style: 0 } },
    { text: "World", style: { fgColor: 31, bgColor: null, fg256: null, bg256: null, use256Color: false, style: 1 } },
    { text: "", style: { fgColor: null, bgColor: null, fg256: null, bg256: null, use256Color: false, style: 0 } }
  ]);

  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const handleSelection = ({ start, end, text }: { start: number, end: number, text: string }) => {
    if (start === end) return;
    
    // Find the segment containing the selection
    let currentPos = 0;
    for (const segment of segments) {
      const segmentStart = currentPos;
      const segmentEnd = currentPos + segment.text.length;
      
      if (start >= segmentStart && start < segmentEnd) {
        setStyle(segment.style.style);
        setFgColor(segment.style.fgColor);
        setBgColor(segment.style.bgColor);
        setUse256Color(segment.style.use256Color);
        if (segment.style.use256Color) {
          if (segment.style.fg256 !== null) setFg256(segment.style.fg256);
          if (segment.style.bg256 !== null) setBg256(segment.style.bg256);
        }
        break;
      }
      currentPos += segment.text.length;
    }
  };

  const updateSegmentStyle = (start: number, end: number) => {
    setSegments(prevSegments => {
      const newSegments: TextSegment[] = [];
      let currentPos = 0;
      
      for (const segment of prevSegments) {
        const segmentStart = currentPos;
        const segmentEnd = currentPos + segment.text.length;
        
        if (start >= segmentStart && start < segmentEnd) {
          // Update the style of this segment
          newSegments.push({
            text: segment.text,
            style: {
              fgColor,
              bgColor,
              fg256: use256Color ? fg256 : null,
              bg256: use256Color ? bg256 : null,
              use256Color,
              style
            }
          });
        } else {
          newSegments.push(segment);
        }
        currentPos += segment.text.length;
      }
      
      return newSegments;
    });
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
                use256Color={use256Color}
                setUse256Color={setUse256Color}
                fg256={fg256}
                setFg256={setFg256}
                bg256={bg256}
                setBg256={setBg256}
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