import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AnsiInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AnsiInput({ value, onChange }: AnsiInputProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    // Convert escape character to \e before copying
    const displayValue = value.replace(/\x1b/g, '\\e');
    navigator.clipboard.writeText(displayValue);
    toast({
      title: "Copied to clipboard",
      description: "The ANSI code has been copied to your clipboard.",
    });
  };

  // Display \e instead of actual escape character
  const displayValue = value.replace(/\x1b/g, '\\e');

  const handleChange = (newValue: string) => {
    // Convert \e back to actual escape character when user types
    const actualValue = newValue.replace(/\\e/g, '\x1b');
    onChange(actualValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Raw</h3>
        <Button variant="ghost" size="icon" onClick={copyToClipboard}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        className="font-mono text-sm bg-code-background text-code-foreground min-h-[100px]"
      />
    </div>
  );
}