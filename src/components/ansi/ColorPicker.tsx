import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { basicColors, indexToRGB } from "@/lib/ansi-utils";

interface ColorPickerProps {
  use256Color: boolean;
  setUse256Color: (use256: boolean) => void;
  fg256: number;
  setFg256: (value: number) => void;
  bg256: number;
  setBg256: (value: number) => void;
  fgColor: number | null;
  setFgColor: (color: number) => void;
  bgColor: number | null;
  setBgColor: (color: number) => void;
}

export function ColorPicker({
  use256Color,
  setUse256Color,
  fg256,
  setFg256,
  bg256,
  setBg256,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
}: ColorPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Color Mode</h3>
        <div className="flex items-center gap-2">
          <span>256 Colors</span>
          <Switch checked={use256Color} onCheckedChange={setUse256Color} />
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
              {Object.entries(basicColors).map(([code, name]) => {
                const colorIndex = parseInt(code) - 30;
                const textColor = colorIndex < 3 ? 'text-white' : 'text-black dark:text-white';
                return (
                  <Button
                    key={code}
                    variant="outline"
                    className={`h-auto py-2 ${fgColor === parseInt(code) ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFgColor(parseInt(code))}
                    style={{
                      color: indexToRGB(colorIndex),
                      borderColor: indexToRGB(colorIndex)
                    }}
                  >
                    <span className={colorIndex === 0 ? textColor : ''}>
                      {name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label>Background Color</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(basicColors).map(([code, name]) => {
                const colorIndex = parseInt(code) - 30;
                const textColor = colorIndex < 3 ? 'text-white' : 'text-black dark:text-white';
                return (
                  <Button
                    key={code}
                    variant="outline"
                    className={`h-auto py-2 ${bgColor === colorIndex ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setBgColor(colorIndex)}
                    style={{
                      backgroundColor: indexToRGB(colorIndex),
                      borderColor: indexToRGB(colorIndex)
                    }}
                  >
                    <span className={textColor}>
                      {name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}