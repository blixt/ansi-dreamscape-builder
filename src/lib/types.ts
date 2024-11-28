export interface TextSegment {
  text: string;
  style: {
    fgColor: number | null;
    bgColor: number | null;
    style: number;
  };
}