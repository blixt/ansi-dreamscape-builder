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
  const [show256Colors, setShow256Colors] = useState(false);

  // Switch to 256-color mode if a color > 15 is selected
  useEffect(() => {
    if ((fgColor !== null && fgColor > 15) || (bgColor !== null && bgColor > 15)) {
      setShow256Colors(true);
    }
  }, [fgColor, bgColor]);

  return (
    <div className="space-y-6">
      {show256Colors ? (
        <>
          <Color256Picker
            label="Foreground Color (0-255)"
            value={fg}
            setValue={setFg}
            colorValue={fgColor}
            setColorValue={setFgColor}
            onModeSwitch={() => setShow256Colors(false)}
          />
          <Color256Picker
            label="Background Color (0-255)"
            value={bg}
            setValue={setBg}
            colorValue={bgColor}
            setColorValue={setBgColor}
            onModeSwitch={() => setShow256Colors(false)}
          />
        </>
      ) : (
        <>
          <BasicColorPicker
            label="Foreground Color"
            selectedColor={fgColor}
            setSelectedColor={setFgColor}
            isForeground={true}
            onModeSwitch={() => setShow256Colors(true)}
          />
          <BasicColorPicker
            label="Background Color"
            selectedColor={bgColor}
            setSelectedColor={setBgColor}
            isForeground={false}
            onModeSwitch={() => setShow256Colors(true)}
          />
        </>
      )}
    </div>
  );
}