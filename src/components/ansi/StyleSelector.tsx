import { Button } from "@/components/ui/button";
import { styles } from "@/lib/ansi-colors";

interface StyleSelectorProps {
  style: number;
  setStyle: (style: number) => void;
}

export function StyleSelector({ style, setStyle }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Text Style</h3>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(styles).map(([value, { name }]) => (
          <Button
            key={value}
            variant={style === parseInt(value) ? "default" : "outline"}
            onClick={() => setStyle(parseInt(value))}
            className="h-auto py-2"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
