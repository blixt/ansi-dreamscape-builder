import React from 'react';
import { TextSegment } from '@/lib/types';
import { parseAnsiCode } from '@/lib/ansi-parser';
import { indexToRGB } from '@/lib/ansi-colors';

const basicColorMap = {
  0: '#000000', 1: '#ff0000', 2: '#00ff00',
  3: '#ffff00', 4: '#0000ff', 5: '#ff00ff',
  6: '#00ffff', 7: '#ffffff', 8: '#808080',
  9: '#ff0000', 10: '#00ff00', 11: '#ffff00',
  12: '#0000ff', 13: '#ff00ff', 14: '#00ffff',
  15: '#ffffff'
};

interface AnsiInputProps {
  segments: TextSegment[];
  setSegments: (segments: TextSegment[]) => void;
  readOnly?: boolean;
}

export function AnsiInput({ segments, setSegments, readOnly = false }: AnsiInputProps) {
  const handleAnsiInput = (input: string) => {
    input = input.replace(/\\e/g, '\x1b').replace(/\\\\/g, '\\');
    
    const newSegments: TextSegment[] = [];
    const regex = /\x1b\[[0-9;]*m|[^\x1b]+/g;
    let matches = input.match(regex);
    
    if (!matches) {
      setSegments([{
        text: input,
        style: { fgColor: null, bgColor: null, style: 0 }
      }]);
      return;
    }

    let currentStyle = {
      style: 0,
      fgColor: null as number | null,
      bgColor: null as number | null,
      customCode: ''
    };

    let currentText = '';
    
    for (const match of matches) {
      if (match.startsWith('\x1b[')) {
        if (currentText) {
          newSegments.push({
            text: currentText,
            style: { ...currentStyle }
          });
          currentText = '';
        }
        
        const parseResult = parseAnsiCode(match, currentStyle);
        
        currentStyle = {
          style: parseResult.style,
          fgColor: parseResult.fgColor,
          bgColor: parseResult.bgColor,
          customCode: parseResult.customCode
        };
      } else {
        currentText += match;
      }
    }
    
    if (currentText) {
      newSegments.push({
        text: currentText,
        style: { ...currentStyle }
      });
    }
    
    setSegments(newSegments);
  };

  const getRawAnsi = () => {
    return segments.map(segment => {
      let prefix = '';
      if (segment.style.style !== 0 || segment.style.fgColor !== null || segment.style.bgColor !== null) {
        const codes = [];
        if (segment.style.style !== 0) codes.push(segment.style.style);
        if (segment.style.fgColor !== null) codes.push(`38;5;${segment.style.fgColor}`);
        if (segment.style.bgColor !== null) codes.push(`48;5;${segment.style.bgColor}`);
        prefix = `\x1b[${codes.join(';')}m`;
      }
      return prefix + segment.text;
    }).join('')
    .replace(/\\/g, '\\\\')
    .replace(/\x1b/g, '\\e');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Raw</h3>
      <textarea
        value={getRawAnsi()}
        onChange={(e) => handleAnsiInput(e.target.value)}
        className="w-full h-40 p-2 font-mono text-sm bg-code-background text-code-foreground border rounded"
        placeholder="Enter ANSI codes here"
        readOnly={readOnly}
      />
    </div>
  );
}