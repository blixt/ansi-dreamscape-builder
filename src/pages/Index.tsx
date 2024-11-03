import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Sun, Moon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { styles, basicColors, indexToRGB, parseAnsiCode } from '@/lib/ansi-utils';

const Index = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [style, setStyle] = useState(0);
  const [fgColor, setFgColor] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<number | null>(null);
  const [fg256, setFg256] = useState(1);
  const [bg256, setBg256] = useState(1);
  const [use256Color, setUse256Color] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [ansiInput, setAnsiInput] = useState('');

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
      if (fg256 !== null) parts.push(`38;5;${fg256}`);
      if (bg256 !== null) parts.push(`48;5;${bg256}`);
    } else {
      if (fgColor !== null) parts.push(fgColor);
      if (bgColor !== null) parts.push(bgColor + 10);
    }

    if (customCode) {
      parts.push(customCode);
    }
    
    return parts.length ? `\\x1b[${parts.join(';')}m` : '';
  };

  const getPreviewStyle = () => {
    const styles: Record<string, any> = {};
    
    if (use256Color) {
      if (fg256 !== null) styles.color = indexToRGB(fg256);
      if (bg256 !== null) styles.backgroundColor = indexToRGB(bg256);
    } else {
      const basicColorMap = {
        30: '#000000', 31: '#ff0000', 32: '#00ff00',
        33: '#ffff00', 34: '#0000ff', 35: '#ff00ff',
        36: '#00ffff', 37: '#ffffff'
      };
      
      if (fgColor !== null) styles.color = basicColorMap[fgColor as keyof typeof basicColorMap];
      if (bgColor !== null) styles.backgroundColor = basicColorMap[(bgColor + 30) as keyof typeof basicColorMap];
    }
    
    if (style === 1) styles.fontWeight = 'bold';
    if (style === 2) styles.opacity = 0.5;
    if (style === 3) styles.fontStyle = 'italic';
    if (style === 4) styles.textDecoration = 'underline';
    if (style === 5) styles.animation = 'blink 1s step-end infinite';
    if (style === 7) {
      const temp = styles.color;
      styles.color = styles.backgroundColor;
      styles.backgroundColor = temp;
    }
    if (style === 9) styles.textDecoration = 'line-through';
    
    return styles;
  };

  const handleAnsiInput = (value: string) => {
    setAnsiInput(value);
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              value={ansiInput}
              onChange={(e) => handleAnsiInput(e.target.value)}
              placeholder="Enter ANSI code (e.g., \x1b[1;31m)"
              className="font-mono"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Text Style</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(styles).map(([value, { name }]) => (
                    <Button
                      key={value}
                      variant={style === parseInt(value) ? "default" : "outline"}
                      onClick={() => setStyle(parseInt(value))}
                      className="h-auto py-2"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Color Mode</h3>
                  <div className="flex items-center gap-2">
                    <span>256 Colors</span>
                    <Switch
                      checked={use256Color}
                      onCheckedChange={setUse256Color}
                    />
                  </div>
                </div>

                {use256Color ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label>Foreground Color (0-255)</label>
                      <Slider
                        value={[fg256]}
                        onValueChange={(value) => setFg256(value[0])}
                        max={255}
                        step={1}
                      />
                      <div className="h-4 rounded" style={{ backgroundColor: indexToRGB(fg256) }} />
                    </div>

                    <div className="space-y-2">
                      <label>Background Color (0-255)</label>
                      <Slider
                        value={[bg256]}
                        onValueChange={(value) => setBg256(value[0])}
                        max={255}
                        step={1}
                      />
                      <div className="h-4 rounded" style={{ backgroundColor: indexToRGB(bg256) }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label>Foreground Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(basicColors).map(([code, name]) => (
                          <Button
                            key={code}
                            variant="outline"
                            className={`h-auto py-2 ${fgColor === parseInt(code) ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setFgColor(parseInt(code))}
                            style={{
                              color: indexToRGB(parseInt(code) - 30),
                              borderColor: indexToRGB(parseInt(code) - 30)
                            }}
                          >
                            {name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label>Background Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(basicColors).map(([code, name]) => (
                          <Button
                            key={code}
                            variant="outline"
                            className={`h-auto py-2 ${bgColor === parseInt(code) - 30 ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setBgColor(parseInt(code) - 30)}
                            style={{
                              backgroundColor: indexToRGB(parseInt(code) - 30),
                              borderColor: indexToRGB(parseInt(code) - 30)
                            }}
                          >
                            <span className={parseInt(code) - 30 < 3 ? 'text-white' : ''}>
                              {name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                <pre className="p-4 rounded bg-code-background text-code-foreground font-mono text-sm overflow-x-auto">
                  {getAnsiCode()}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="ansi-preview" style={getPreviewStyle()}>
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Common ANSI Codes</h3>
                <div className="space-y-2 font-mono text-sm">
                  <div>Reset: \x1b[0m</div>
                  <div>Move Up: \x1b[{'{n}'}A</div>
                  <div>Move Down: \x1b[{'{n}'}B</div>
                  <div>Move Right: \x1b[{'{n}'}C</div>
                  <div>Move Left: \x1b[{'{n}'}D</div>
                  <div>Clear Screen: \x1b[2J</div>
                  <div>Clear Line: \x1b[K</div>
                  <div>Save Position: \x1b[s</div>
                  <div>Restore Position: \x1b[u</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;