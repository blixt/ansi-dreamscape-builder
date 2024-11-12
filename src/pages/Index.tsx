import { useState, useReducer } from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { ThemeToggle } from '@/components/ansi/ThemeToggle';
import { StyleSelector } from '@/components/ansi/StyleSelector';
import { ColorPicker } from '@/components/ansi/ColorPicker';
import { Preview } from '@/components/ansi/Preview';
import { AnsiInput } from '@/components/ansi/AnsiInput';
import { textStateReducer, initialState } from '@/lib/text-state-machine';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(textStateReducer, initialState);

  const handleSelection = (selection: { start: number, end: number, text: string } | null) => {
    dispatch({ type: 'SET_SELECTION', payload: selection ? { start: selection.start, end: selection.end } : null });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">ANSI Code Visualizer</h1>
            <ThemeToggle />
          </div>

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
              />
              <Preview 
                segments={state.segments}
                onSelect={handleSelection}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;