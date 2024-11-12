import { TextState, Action } from './text-state/types';
import { getSegmentAtPosition, updateSegmentsInRange } from './text-state/segment-utils';

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