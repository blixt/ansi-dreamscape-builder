import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { parseAnsiCode } from '@/lib/ansi-parser';
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { AnsiInput } from '@/components/ansi/AnsiInput';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [style, setStyle] = useState(0);
  const [fgColor, setFgColor] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<number | null>(null);
  const [fg256, setFg256] = useState(1);
  const [bg256, setBg256] = useState(1);
  const [use256Color, setUse256Color] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [ansiCode, setAnsiCode] = useState('Hello \\e[1;31mWorld\\e[0m');

  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const handleSelection = ({ start, end }: { start: number, end: number }) => {
    if (start === end) return;
    
    // Get the ANSI code at the start of selection
    const code = ansiCode.substring(0, start);
    const parsed = parseAnsiCode(code);
    
    // Update the UI state based on the parsed code
    setStyle(parsed.style);
    setFgColor(parsed.fgColor);
    setBgColor(parsed.bgColor);
    setUse256Color(parsed.use256Color);
    if (parsed.use256Color) {
      if (parsed.fg256 !== null) setFg256(parsed.fg256);
      if (parsed.bg256 !== null) setBg256(parsed.bg256);
    }
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
                value={ansiCode} 
                onChange={setAnsiCode} 
              />
              <Preview 
                ansiCode={ansiCode}
                onSelect={handleSelection}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;