import { Switch } from "@/components/ui/switch";
import { Color256Picker } from "./Color256Picker";
import { BasicColorPicker } from "./BasicColorPicker";

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
          <Color256Picker
            label="Foreground Color (0-255)"
            value={fg256}
            setValue={setFg256}
            colorValue={fgColor}
            setColorValue={setFgColor}
          />
          <Color256Picker
            label="Background Color (0-255)"
            value={bg256}
            setValue={setBg256}
            colorValue={bgColor}
            setColorValue={setBgColor}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <BasicColorPicker
            label="Foreground Color"
            selectedColor={fgColor}
            setSelectedColor={setFgColor}
            isForeground={true}
          />
          <BasicColorPicker
            label="Background Color"
            selectedColor={bgColor}
            setSelectedColor={setBgColor}
            isForeground={false}
          />
        </div>
      )}
    </div>
  );
}