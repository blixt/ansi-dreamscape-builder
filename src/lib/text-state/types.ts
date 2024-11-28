import { TextSegment } from '../types';

export interface TextState {
  segments: TextSegment[];
  selection: { start: number; end: number } | null;
  activeStyle: number;
  activeFgColor: number | null;
  activeBgColor: number | null;
}

export type Action = 
  | { type: 'SET_SELECTION'; payload: { start: number; end: number } | null }
  | { type: 'SET_STYLE'; payload: number }
  | { type: 'SET_FG_COLOR'; payload: number | null }
  | { type: 'SET_BG_COLOR'; payload: number | null }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'UPDATE_SEGMENTS'; payload: TextSegment[] };