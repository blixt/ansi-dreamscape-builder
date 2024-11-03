import { describe, it, expect } from 'vitest';
import { parseAnsiCode, AnsiParseResult } from '../ansi-parser';

describe('parseAnsiCode', () => {
  it('parses basic foreground color', () => {
    const result = parseAnsiCode('31');
    expect(result).toEqual({
      style: 0,
      fgColor: 31,
      bgColor: null,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });

  it('parses basic background color', () => {
    const result = parseAnsiCode('41');
    expect(result).toEqual({
      style: 0,
      fgColor: null,
      bgColor: 1,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });

  it('parses 256 foreground color', () => {
    const result = parseAnsiCode('38;5;196');
    expect(result).toEqual({
      style: 0,
      fgColor: null,
      bgColor: null,
      fg256: 196,
      bg256: null,
      use256Color: true,
      customCode: '',
    });
  });

  it('parses 256 background color', () => {
    const result = parseAnsiCode('48;5;196');
    expect(result).toEqual({
      style: 0,
      fgColor: null,
      bgColor: null,
      fg256: null,
      bg256: 196,
      use256Color: true,
      customCode: '',
    });
  });

  it('parses style attributes', () => {
    const result = parseAnsiCode('1;3;4');
    expect(result).toEqual({
      style: 4,
      fgColor: null,
      bgColor: null,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });

  it('parses combined attributes', () => {
    const result = parseAnsiCode('1;31;42');
    expect(result).toEqual({
      style: 1,
      fgColor: 31,
      bgColor: 2,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });

  it('handles escape sequences', () => {
    const result = parseAnsiCode('\x1b[31;42m');
    expect(result).toEqual({
      style: 0,
      fgColor: 31,
      bgColor: 2,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });

  it('handles custom codes', () => {
    const result = parseAnsiCode('6;1;4');
    expect(result).toEqual({
      style: 4,
      fgColor: null,
      bgColor: null,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '6',
    });
  });

  it('handles empty input', () => {
    const result = parseAnsiCode('');
    expect(result).toEqual({
      style: 0,
      fgColor: null,
      bgColor: null,
      fg256: null,
      bg256: null,
      use256Color: false,
      customCode: '',
    });
  });
});
