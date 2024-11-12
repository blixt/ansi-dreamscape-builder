import { Button } from "@/components/ui/button";
import { indexToRGB } from "@/lib/ansi-colors";

interface BasicColorPickerProps {
  label: string;
  selectedColor: number | null;
  setSelectedColor: (color: number | null) => void;
  isForeground?: boolean;
}

export function BasicColorPicker({
  label,
  selectedColor,
  setSelectedColor,
  isForeground = true,
}: BasicColorPickerProps) {
  const basicColors = {
    0: 'Black', 1: 'Red', 2: 'Green',
    3: 'Yellow', 4: 'Blue', 5: 'Magenta',
    6: 'Cyan', 7: 'White', 8: 'Gray',
    9: 'Bright Red', 10: 'Bright Green', 11: 'Bright Yellow',
    12: 'Bright Blue', 13: 'Bright Magenta', 14: 'Bright Cyan',
    15: 'Bright White'
  };

  return (
    <div className="space-y-2">
      <label>{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(basicColors).map(([code, name]) => {
          const colorIndex = parseInt(code);
          const isBlack = colorIndex === 0;
          const isSelected = selectedColor === colorIndex;
          const textColor = !isForeground && colorIndex < 3 ? 'text-white' : 'text-black dark:text-white';
          
          return (
            <Button
              key={code}
              variant="outline"
              className={`h-auto py-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedColor(isSelected ? null : colorIndex)}
              style={{
                ...(isForeground 
                  ? { color: isBlack ? undefined : indexToRGB(colorIndex) }
                  : { backgroundColor: indexToRGB(colorIndex) }),
                borderColor: indexToRGB(colorIndex)
              }}
            >
              <span className={isForeground && isBlack ? 'text-foreground dark:text-muted-foreground/50' : textColor}>
                {name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}