import { TextSegment } from './types';

export interface TextState {
  // Current segments to render
  segments: TextSegment[];
  // Currently active selection
  selection: { start: number; end: number } | null;
  // UI state for what's currently selected in the toolbar
  activeStyle: number;
  activeFgColor: number | null;
  activeBgColor: number | null;
}

type Action = 
  | { type: 'SET_SELECTION'; payload: { start: number; end: number } | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_STYLE'; payload: number }
  | { type: 'SET_FG_COLOR'; payload: number | null }
  | { type: 'SET_BG_COLOR'; payload: number | null }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'UPDATE_SEGMENTS'; payload: TextSegment[] };

const getSegmentAtPosition = (segments: TextSegment[], position: number): TextSegment | null => {
  let currentPos = 0;
  for (const segment of segments) {
    if (position >= currentPos && position < currentPos + segment.text.length) {
      return segment;
    }
    currentPos += segment.text.length;
  }
  return null;
};

const updateSegmentsInRange = (
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
      // Handle segment that overlaps with selection
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
            // Preserve existing properties unless explicitly updated
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

  // Merge adjacent segments with identical styles
  return newSegments.reduce((acc: TextSegment[], curr: TextSegment) => {
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

export const initialState: TextState = {
  segments: [{ 
    text: "Hello World", 
    style: { fgColor: null, bgColor: null, style: 0 } 
  }],
  selection: null,
  activeStyle: 0,
  activeFgColor: null,
  activeBgColor: null,
};

export const textStateReducer = (state: TextState, action: Action): TextState => {
  switch (action.type) {
    case 'SET_SELECTION': {
      if (!action.payload) {
        return {
          ...state,
          selection: null
        };
      }

      // When setting a new selection, update the active styles based on the first selected segment
      const firstSelectedSegment = getSegmentAtPosition(state.segments, action.payload.start);
      
      return {
        ...state,
        selection: action.payload,
        activeStyle: firstSelectedSegment?.style.style ?? 0,
        activeFgColor: firstSelectedSegment?.style.fgColor ?? null,
        activeBgColor: firstSelectedSegment?.style.bgColor ?? null
      };
    }

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selection: null
      };

    case 'SET_STYLE': {
      const { selection, segments } = state;
      if (!selection) return state;

      return {
        ...state,
        activeStyle: action.payload,
        segments: updateSegmentsInRange(segments, selection.start, selection.end, {
          style: action.payload
        })
      };
    }

    case 'SET_FG_COLOR': {
      const { selection, segments } = state;
      if (!selection) return state;

      return {
        ...state,
        activeFgColor: action.payload,
        segments: updateSegmentsInRange(segments, selection.start, selection.end, {
          fgColor: action.payload
        })
      };
    }

    case 'SET_BG_COLOR': {
      const { selection, segments } = state;
      if (!selection) return state;

      return {
        ...state,
        activeBgColor: action.payload,
        segments: updateSegmentsInRange(segments, selection.start, selection.end, {
          bgColor: action.payload
        })
      };
    }

    case 'SET_CONTENT':
      // Here you would parse the ANSI string into segments
      // For now, we'll just create a single segment
      return {
        ...state,
        segments: [{
          text: action.payload,
          style: { fgColor: null, bgColor: null, style: 0 }
        }]
      };

    case 'UPDATE_SEGMENTS':
      return {
        ...state,
        segments: action.payload
      };

    default:
      return state;
  }
};