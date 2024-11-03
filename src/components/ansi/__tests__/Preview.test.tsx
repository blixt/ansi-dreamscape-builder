import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preview } from '../Preview';

describe('Preview', () => {
  it('renders with basic foreground color', () => {
    render(<Preview ansiCode="\x1b[31m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ color: '#ff0000' });
  });

  it('renders with basic background color', () => {
    render(<Preview ansiCode="\x1b[41m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders with 256 foreground color', () => {
    render(<Preview ansiCode="\x1b[38;5;196m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ color: 'rgb(255,0,0)' });
  });

  it('renders with 256 background color', () => {
    render(<Preview ansiCode="\x1b[48;5;196m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({ backgroundColor: 'rgb(255,0,0)' });
  });

  it('renders with style attributes', () => {
    render(<Preview ansiCode="\x1b[1;3;4m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({
      fontWeight: 'bold',
      fontStyle: 'italic',
      textDecoration: 'underline'
    });
  });

  it('handles reverse video mode', () => {
    render(<Preview ansiCode="\x1b[31;42;7m" />);
    const previewText = screen.getByText('The quick brown fox jumps over the lazy dog');
    expect(previewText).toHaveStyle({
      color: '#00ff00',
      backgroundColor: '#ff0000'
    });
  });
});