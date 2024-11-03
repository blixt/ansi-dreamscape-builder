import { Button } from "@/components/ui/button";
import { basicColors, indexToRGB } from "@/lib/ansi-utils";

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
  return (
    <div className="space-y-2">
      <label>{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(basicColors).map(([code, name]) => {
          const colorIndex = parseInt(code) - 30;
          const isBlack = colorIndex === 0;
          const isSelected = selectedColor === (isForeground ? parseInt(code) : colorIndex);
          const textColor = !isForeground && colorIndex < 3 ? 'text-white' : 'text-black dark:text-white';
          
          return (
            <Button
              key={code}
              variant="outline"
              className={`h-auto py-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedColor(isSelected ? null : (isForeground ? parseInt(code) : colorIndex))}
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