import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Preview } from '../Preview';
import { TextSegment } from '@/lib/types';

describe('Preview', () => {
  it('renders with basic foreground color', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: 31, bgColor: null, fg256: null, bg256: null, use256Color: false, style: 0 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ color: '#ff0000' });
  });

  it('renders with basic background color', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: null, bgColor: 1, fg256: null, bg256: null, use256Color: false, style: 0 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders with 256 foreground color', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: null, bgColor: null, fg256: 196, bg256: null, use256Color: true, style: 0 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ color: 'rgb(255,0,0)' });
  });

  it('renders with 256 background color', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: null, bgColor: null, fg256: null, bg256: 196, use256Color: true, style: 0 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ backgroundColor: 'rgb(255,0,0)' });
  });

  it('renders with style attributes', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: null, bgColor: null, fg256: null, bg256: null, use256Color: false, style: 1 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ fontWeight: 'bold' });
  });

  it('handles reverse video mode', () => {
    const segments: TextSegment[] = [{
      text: 'The quick brown fox jumps over the lazy dog',
      style: { fgColor: 31, bgColor: 2, fg256: null, bg256: null, use256Color: false, style: 7 }
    }];
    render(<Preview segments={segments} />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({
      color: '#00ff00',
      backgroundColor: '#ff0000'
    });
  });
});