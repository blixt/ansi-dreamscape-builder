export interface TextSegment {
  text: string;
  style: {
    fgColor: number | null;
    bgColor: number | null;
    fg256: number | null;
    bg256: number | null;
    use256Color: boolean;
    style: number;
  };
}