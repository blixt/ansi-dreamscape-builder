import React from 'react';
import { TextSegment } from '@/lib/types';
import { parseAnsiCode } from '@/lib/ansi-parser';
import { indexToRGB } from '@/lib/ansi-colors';

// Define basicColorMap constant
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
}

export function AnsiInput({ segments, setSegments }: AnsiInputProps) {
  const handleAnsiInput = (input: string) => {
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
      bgColor: null as number | null
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
          bgColor: parseResult.bgColor
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

  return (
    <div>
      <textarea
        onChange={(e) => handleAnsiInput(e.target.value)}
        className="w-full h-40 p-2 border rounded"
        placeholder="Enter ANSI codes here"
      />
      <div className="mt-4">
        {segments.map((segment, index) => (
          <span key={index} style={{
            color: segment.style.fgColor !== null ? (segment.style.fgColor >= 16 ? `rgb(${indexToRGB(segment.style.fgColor)})` : basicColorMap[segment.style.fgColor]) : undefined,
            backgroundColor: segment.style.bgColor !== null ? (segment.style.bgColor >= 16 ? `rgb(${indexToRGB(segment.style.bgColor)})` : basicColorMap[segment.style.bgColor]) : undefined,
            fontWeight: segment.style.style === 1 ? 'bold' : undefined,
            opacity: segment.style.style === 2 ? 0.5 : undefined,
            fontStyle: segment.style.style === 3 ? 'italic' : undefined,
            textDecoration: segment.style.style === 4 ? 'underline' : undefined,
            animation: segment.style.style === 5 ? 'blink 1s step-end infinite' : undefined,
          }}>
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}