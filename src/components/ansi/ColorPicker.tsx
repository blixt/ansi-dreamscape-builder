import { useState, useEffect } from 'react';
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
  const [showFg256Colors, setShowFg256Colors] = useState(false);
  const [showBg256Colors, setShowBg256Colors] = useState(false);

  // Switch to 256-color mode if a color > 15 is selected
  useEffect(() => {
    if (fgColor !== null && fgColor > 15) {
      setShowFg256Colors(true);
    }
    if (bgColor !== null && bgColor > 15) {
      setShowBg256Colors(true);
    }
  }, [fgColor, bgColor]);

  return (
    <div className="space-y-6">
      {showFg256Colors ? (
        <Color256Picker
          label="Foreground Color"
          value={fg}
          setValue={setFg}
          colorValue={fgColor}
          setColorValue={setFgColor}
          onModeSwitch={() => setShowFg256Colors(false)}
        />
      ) : (
        <BasicColorPicker
          label="Foreground Color"
          selectedColor={fgColor}
          setSelectedColor={setFgColor}
          isForeground={true}
          onModeSwitch={() => setShowFg256Colors(true)}
        />
      )}
      {showBg256Colors ? (
        <Color256Picker
          label="Background Color"
          value={bg}
          setValue={setBg}
          colorValue={bgColor}
          setColorValue={setBgColor}
          onModeSwitch={() => setShowBg256Colors(false)}
        />
      ) : (
        <BasicColorPicker
          label="Background Color"
          selectedColor={bgColor}
          setSelectedColor={setBgColor}
          isForeground={false}
          onModeSwitch={() => setShowBg256Colors(true)}
        />
      )}
    </div>
  );
}