import { ColorPreview } from "./ColorPreview";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Color256PickerProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  colorValue: number | null;
  setColorValue: (value: number | null) => void;
  onModeSwitch: () => void;
}

export function Color256Picker({
  label,
  value,
  setValue,
  colorValue,
  setColorValue,
  onModeSwitch,
}: Color256PickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label>{label}</label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onModeSwitch}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Switch to basic colors
        </Button>
      </div>
      <div>
        <div className="flex flex-wrap gap-[2px] mt-2">
          {Array.from({ length: 256 }, (_, i) => (
            <ColorPreview 
              key={i} 
              value={i} 
              onClick={(newValue) => {
                setValue(newValue);
                setColorValue(newValue);
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}