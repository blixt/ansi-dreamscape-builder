import { indexToRGB } from "@/lib/ansi-colors";

interface ColorPreviewProps {
  value: number;
  onClick: (value: number) => void;
}

export function ColorPreview({ value, onClick }: ColorPreviewProps) {
  return (
    <div 
      className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
      style={{ backgroundColor: indexToRGB(value) }}
      onClick={() => onClick(value)}
      title={`Color ${value}`}
    />
  );
}