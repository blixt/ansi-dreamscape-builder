import { indexToRGB } from "@/lib/ansi-colors";

interface ColorPreviewProps {
  value: number;
  onClick: (value: number) => void;
}

export function ColorPreview({ value, onClick }: ColorPreviewProps) {
  return (
    <div 
      className="w-[calc((100%-62px)/32)] aspect-square cursor-pointer hover:scale-110 transition-transform rounded-sm" 
      style={{ backgroundColor: indexToRGB(value) }}
      onClick={() => onClick(value)}
      title={`Color ${value}`}
    />
  );
}