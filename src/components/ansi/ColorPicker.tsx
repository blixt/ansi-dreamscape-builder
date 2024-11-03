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
  setFgColor: (color: number | null) => void;
  bgColor: number | null;
  setBgColor: (color: number | null) => void;
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
  const ColorPreview = ({ value, onClick }: { value: number, onClick: (value: number) => void }) => (
    <div 
      className="h-6 w-2 cursor-pointer hover:scale-y-110 transition-transform" 
      style={{ backgroundColor: indexToRGB(value) }}
      onClick={() => onClick(value)}
    />
  );

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
            <div className="flex items-center justify-between">
              <label>Foreground Color (0-255)</label>
              <div className="flex items-center gap-2">
                <span>Enable</span>
                <Switch 
                  checked={fgColor !== null} 
                  onCheckedChange={(checked) => setFgColor(checked ? fg256 : null)} 
                />
              </div>
            </div>
            <Slider
              value={[fg256]}
              onValueChange={(value) => setFg256(value[0])}
              max={255}
              step={1}
              disabled={fgColor === null}
            />
            <div className="flex overflow-x-auto py-2 gap-[1px]">
              {Array.from({ length: 256 }, (_, i) => (
                <ColorPreview key={i} value={i} onClick={setFg256} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label>Background Color (0-255)</label>
              <div className="flex items-center gap-2">
                <span>Enable</span>
                <Switch 
                  checked={bgColor !== null} 
                  onCheckedChange={(checked) => setBgColor(checked ? bg256 : null)} 
                />
              </div>
            </div>
            <Slider
              value={[bg256]}
              onValueChange={(value) => setBg256(value[0])}
              max={255}
              step={1}
              disabled={bgColor === null}
            />
            <div className="flex overflow-x-auto py-2 gap-[1px]">
              {Array.from({ length: 256 }, (_, i) => (
                <ColorPreview key={i} value={i} onClick={setBg256} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label>Foreground Color</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(basicColors).map(([code, name]) => {
                const colorIndex = parseInt(code) - 30;
                const isBlack = colorIndex === 0;
                const isSelected = fgColor === parseInt(code);
                return (
                  <Button
                    key={code}
                    variant="outline"
                    className={`h-auto py-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFgColor(isSelected ? null : parseInt(code))}
                    style={{
                      color: isBlack ? undefined : indexToRGB(colorIndex),
                      borderColor: indexToRGB(colorIndex)
                    }}
                  >
                    <span className={isBlack ? 'text-foreground dark:text-muted-foreground/50' : ''}>
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
                const isSelected = bgColor === colorIndex;
                return (
                  <Button
                    key={code}
                    variant="outline"
                    className={`h-auto py-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setBgColor(isSelected ? null : colorIndex)}
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