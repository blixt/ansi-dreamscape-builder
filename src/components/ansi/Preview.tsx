interface PreviewProps {
  previewStyle: React.CSSProperties;
}

export function Preview({ previewStyle }: PreviewProps) {
  const finalStyle = {
    ...previewStyle,
    // Override the color if it's black or white to use theme-specific colors
    color: previewStyle.color === '#000000' ? undefined : previewStyle.color,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div 
        className={`ansi-preview ${previewStyle.color === '#000000' ? 'text-black dark:text-white' : ''}`} 
        style={finalStyle}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
}