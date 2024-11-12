import { TextSegment } from '../types';

export const getSegmentAtPosition = (segments: TextSegment[], position: number): TextSegment | null => {
  let currentPos = 0;
  for (const segment of segments) {
    if (position >= currentPos && position < currentPos + segment.text.length) {
      return segment;
    }
    currentPos += segment.text.length;
  }
  return null;
};

export const updateSegmentsInRange = (
  segments: TextSegment[],
  start: number,
  end: number,
  updates: Partial<TextSegment['style']>
): TextSegment[] => {
  let currentPos = 0;
  let newSegments: TextSegment[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const segmentStart = currentPos;
    const segmentEnd = currentPos + segment.text.length;
    
    if (end <= segmentStart || start >= segmentEnd) {
      newSegments.push(segment);
    } else {
      if (start > segmentStart) {
        newSegments.push({
          text: segment.text.substring(0, start - segmentStart),
          style: { ...segment.style }
        });
      }

      const selectionStartInSegment = Math.max(0, start - segmentStart);
      const selectionEndInSegment = Math.min(segment.text.length, end - segmentStart);
      const selectedText = segment.text.substring(selectionStartInSegment, selectionEndInSegment);
      
      if (selectedText) {
        newSegments.push({
          text: selectedText,
          style: {
            ...segment.style,
            ...updates
          }
        });
      }

      if (end < segmentEnd) {
        newSegments.push({
          text: segment.text.substring(selectionEndInSegment),
          style: { ...segment.style }
        });
      }
    }
    
    currentPos += segment.text.length;
  }

  return optimizeSegments(newSegments.filter(segment => segment.text.length > 0));
};

export const optimizeSegments = (segments: TextSegment[]): TextSegment[] => {
  return segments.reduce((acc: TextSegment[], curr: TextSegment) => {
    if (acc.length === 0) return [curr];
    
    const last = acc[acc.length - 1];
    const canMerge = 
      last.style.style === curr.style.style &&
      last.style.fgColor === curr.style.fgColor &&
      last.style.bgColor === curr.style.bgColor;
    
    if (canMerge) {
      acc[acc.length - 1] = {
        text: last.text + curr.text,
        style: last.style
      };
    } else {
      acc.push(curr);
    }
    
    return acc;
  }, []);
};