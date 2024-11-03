import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { parseAnsiCode } from '@/lib/ansi-utils';
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { useTheme } from "next-themes";

const Index = () => {
  const { toast } = useToast();
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getAnsiCode());
    toast({
      title: "Copied to clipboard",
      description: "The ANSI code has been copied to your clipboard.",
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
              <div className="space-y-2">
                <label>Custom Parameters</label>
                <Input
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. 6;1;4"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">ANSI Code</h3>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  value={getAnsiCode()}
                  onChange={(e) => handleAnsiInput(e.target.value)}
                  className="w-full p-4 rounded bg-code-background text-code-foreground font-mono text-sm"
                />
              </div>
              <Preview ansiCode={getAnsiCode()} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;