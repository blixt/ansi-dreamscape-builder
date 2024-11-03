interface ColorPreviewProps {
  value: number;
  onClick: (value: number) => void;
}

export function ColorPreview({ value, onClick }: ColorPreviewProps) {
  return (
    <div 
      className="h-6 w-2 cursor-pointer hover:scale-y-110 transition-transform" 
      style={{ backgroundColor: indexToRGB(value) }}
      onClick={() => onClick(value)}
    />
  );
}