import { Color256Picker } from "./Color256Picker";
import { BasicColorPicker } from "./BasicColorPicker";

interface ColorPickerProps {
  fg: number;
  setFg: (value: number) => void;
  bg: number;
  setBg: (value: number) => void;
  fgColor: number | null;
  setFgColor: (color: number | null) => void;
  bgColor: number | null;
  setBgColor: (color: number | null) => void;
}

export function ColorPicker({
  fg,
  setFg,
  bg,
  setBg,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
}: ColorPickerProps) {
  return (
    <div className="space-y-6">
      <Color256Picker
        label="Foreground Color (0-255)"
        value={fg}
        setValue={setFg}
        colorValue={fgColor}
        setColorValue={setFgColor}
      />
      <Color256Picker
        label="Background Color (0-255)"
        value={bg}
        setValue={setBg}
        colorValue={bgColor}
        setColorValue={setBgColor}
      />
    </div>
  );
}