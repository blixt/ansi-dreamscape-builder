import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { parseAnsiCode } from '@/lib/ansi-utils';
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

  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const getAnsiCode = () => {
    const parts = [];
    
    if (style !== 0) {
      parts.push(style);
    }
    
    if (use256Color) {
      if (fgColor !== null) parts.push(`38;5;${fg256}`);
      if (bgColor !== null) parts.push(`48;5;${bg256}`);
    } else {
      if (fgColor !== null) parts.push(fgColor);
      if (bgColor !== null) parts.push(bgColor + 10);
    }

    if (customCode) {
      parts.push(customCode);
    }
    
    return parts.length ? `\\x1b[${parts.join(';')}m` : '';
  };

  const handleAnsiInput = (value: string) => {
    try {
      const parsed = parseAnsiCode(value);
      setStyle(parsed.style);
      setFgColor(parsed.fgColor);
      setBgColor(parsed.bgColor);
      setFg256(parsed.fg256 ?? 1);
      setBg256(parsed.bg256 ?? 1);
      setUse256Color(parsed.use256Color);
      setCustomCode(parsed.customCode);
    } catch (error) {
      console.error('Failed to parse ANSI code:', error);
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
                value={getAnsiCode()} 
                onChange={handleAnsiInput} 
              />
              <Preview ansiCode={getAnsiCode()} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;