interface PreviewProps {
  previewStyle: React.CSSProperties;
}

export function Preview({ previewStyle }: PreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div 
        className="w-full p-4 rounded bg-code-background font-mono text-sm"
        style={previewStyle}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
}