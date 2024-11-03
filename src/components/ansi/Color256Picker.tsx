import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorPreview } from "./ColorPreview";
import { indexToRGB } from "@/lib/ansi-utils";

interface Color256PickerProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  colorValue: number | null;
  setColorValue: (value: number | null) => void;
}

export function Color256Picker({
  label,
  value,
  setValue,
  colorValue,
  setColorValue,
}: Color256PickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label>{label}</label>
        <div className="flex items-center gap-2">
          <span>Enable</span>
          <Switch 
            checked={colorValue !== null} 
            onCheckedChange={(checked) => {
              setColorValue(checked ? value : null);
            }} 
          />
        </div>
      </div>
      <div className={colorValue === null ? "opacity-50" : ""}>
        <Slider
          value={[value]}
          onValueChange={(newValue) => {
            setValue(newValue[0]);
            if (colorValue !== null) {
              setColorValue(newValue[0]);
            }
          }}
          max={255}
          step={1}
          disabled={colorValue === null}
        />
        <div className="flex overflow-x-auto py-2 gap-[1px]">
          {Array.from({ length: 256 }, (_, i) => (
            <ColorPreview 
              key={i} 
              value={i} 
              onClick={(newValue) => {
                setValue(newValue);
                if (colorValue !== null) {
                  setColorValue(newValue);
                }
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}