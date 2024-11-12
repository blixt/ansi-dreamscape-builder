import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TextSegment } from "@/lib/types";

interface AnsiInputProps {
  segments: TextSegment[];
  setSegments: (segments: TextSegment[]) => void;
}

export function AnsiInput({ segments, setSegments }: AnsiInputProps) {
  const { toast } = useToast();

  const segmentsToAnsiString = (segments: TextSegment[]): string => {
    return segments.map(segment => {
      let code = '';
      if (segment.style.style !== 0 || segment.style.fgColor !== null || 
          segment.style.bgColor !== null) {
        const parts = [];
        
        if (segment.style.style !== 0) parts.push(segment.style.style);
        
        if (segment.style.fgColor !== null) {
          if (segment.style.fgColor >= 16) {
            parts.push(`38;5;${segment.style.fgColor}`);
          } else {
            parts.push(segment.style.fgColor + 30);
          }
        }
        
        if (segment.style.bgColor !== null) {
          if (segment.style.bgColor >= 16) {
            parts.push(`48;5;${segment.style.bgColor}`);
          } else {
            parts.push(segment.style.bgColor + 40);
          }
        }
        
        code = `\\e[${parts.join(';')}m`;
      }
      return code + segment.text;
    }).join('') + '\\e[0m';
  };

  const copyToClipboard = () => {
    const ansiString = segmentsToAnsiString(segments);
    navigator.clipboard.writeText(ansiString);
    toast({
      title: "Copied to clipboard",
      description: "The ANSI code has been copied to your clipboard.",
    });
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
        value={segmentsToAnsiString(segments)}
        readOnly
        className="font-mono text-sm bg-code-background text-code-foreground min-h-[100px]"
      />
    </div>
  );
}