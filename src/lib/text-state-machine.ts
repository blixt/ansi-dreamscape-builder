import { TextState, Action } from './text-state/types';
import { getSegmentAtPosition, updateSegmentsInRange } from './text-state/segment-utils';
import { produce } from 'immer';

export const initialState: TextState = {
  segments: [
    { 
      text: "Hello ", 
      style: { fgColor: null, bgColor: null, style: 0 } 
    },
    {
      text: "World",
      style: { fgColor: 1, bgColor: null, style: 1 }
    }
  ],
  selection: null,
  activeStyle: 0,
  activeFgColor: null,
  activeBgColor: null,
};

export const textStateReducer = (state: TextState, action: Action): TextState => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_SELECTION': {
        if (!action.payload) {
          draft.selection = null;
          return;
        }

        const firstSelectedSegment = getSegmentAtPosition(state.segments, action.payload.start);
        draft.selection = action.payload;
        draft.activeStyle = firstSelectedSegment?.style.style ?? 0;
        draft.activeFgColor = firstSelectedSegment?.style.fgColor ?? null;
        draft.activeBgColor = firstSelectedSegment?.style.bgColor ?? null;
        return;
      }

      case 'SET_STYLE': {
        if (!draft.selection) return;
        draft.activeStyle = action.payload;
        draft.segments = updateSegmentsInRange(draft.segments, draft.selection.start, draft.selection.end, {
          style: action.payload
        });
        return;
      }

      case 'SET_FG_COLOR': {
        if (!draft.selection) return;
        draft.activeFgColor = action.payload;
        draft.segments = updateSegmentsInRange(draft.segments, draft.selection.start, draft.selection.end, {
          fgColor: action.payload
        });
        return;
      }

      case 'SET_BG_COLOR': {
        if (!draft.selection) return;
        draft.activeBgColor = action.payload;
        draft.segments = updateSegmentsInRange(draft.segments, draft.selection.start, draft.selection.end, {
          bgColor: action.payload
        });
        return;
      }

      case 'SET_CONTENT':
        draft.segments = [{
          text: action.payload,
          style: { fgColor: null, bgColor: null, style: 0 }
        }];
        return;

      case 'UPDATE_SEGMENTS':
        draft.segments = action.payload;
        return;
    }
  });
};