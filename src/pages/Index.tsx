import { useState, useReducer } from 'react';
import { useTheme } from "next-themes";
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { AnsiInput } from '@/components/ansi/AnsiInput';
import { textStateReducer, initialState } from '@/lib/text-state-machine';
import { useToast } from '@/components/ui/use-toast';

const initialSegments = [
  { text: "Lorem ipsum dolor sit amet, ", style: { fgColor: 196, bgColor: null, style: 0 } },
  { text: "consectetur adipiscing elit", style: { fgColor: null, bgColor: 34, style: 1 } },
  { text: ". Sed do eiusmod ", style: { fgColor: null, bgColor: null, style: 3 } },
  { text: "tempor incididunt", style: { fgColor: 51, bgColor: 235, style: 1 } },
  { text: " ut labore et dolore magna aliqua.", style: { fgColor: null, bgColor: null, style: 0 } }
];

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(textStateReducer, {
    ...initialState,
    segments: initialSegments
  });

  const handleSelection = (selection: { start: number, end: number, text: string } | null) => {
    dispatch({ type: 'SET_SELECTION', payload: selection ? { start: selection.start, end: selection.end } : null });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ANSI Code Visualizer</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StyleSelector 
                style={state.activeStyle} 
                setStyle={(style) => dispatch({ type: 'SET_STYLE', payload: style })} 
              />
              <ColorPicker
                fg={state.activeFgColor ?? 0}
                setFg={(color) => dispatch({ type: 'SET_FG_COLOR', payload: color })}
                bg={state.activeBgColor ?? 0}
                setBg={(color) => dispatch({ type: 'SET_BG_COLOR', payload: color })}
                fgColor={state.activeFgColor}
                setFgColor={(color) => dispatch({ type: 'SET_FG_COLOR', payload: color })}
                bgColor={state.activeBgColor}
                setBgColor={(color) => dispatch({ type: 'SET_BG_COLOR', payload: color })}
              />
            </div>

            <div className="space-y-6">
              <AnsiInput 
                segments={state.segments}
                setSegments={(segments) => dispatch({ type: 'UPDATE_SEGMENTS', payload: segments })}
                readOnly={true}
              />
              <div className="space-y-2">
                <Preview 
                  segments={state.segments}
                  onSelect={handleSelection}
                />
                <p className="text-sm text-muted-foreground">
                  Select text in the preview above and use the style controls on the left to update its formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;