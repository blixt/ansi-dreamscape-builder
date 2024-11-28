# ANSI Code Visualizer

A web-based tool for creating and visualizing ANSI escape sequences. This tool helps developers understand and experiment with terminal text formatting using a visual interface.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```
3. Start the development server:
```bash
bun run dev
```
4. Open your browser and navigate to `http://localhost:5173`

<img width="1107" alt="image" src="https://github.com/user-attachments/assets/d66ffc22-8bca-47e2-b3bc-aeb12b73ce61">

## Features

- **Visual Text Formatting**: Select text and apply various styles:
  - Basic text styles (bold, italic, underline)
  - 16 basic terminal colors for foreground and background
  - Extended 256-color support
- **Live Preview**: See your formatted text in real-time
- **ANSI Code Generation**: Automatically generates the corresponding ANSI escape sequences
- **Dark/Light Mode Support**: Comfortable viewing in any environment

## How to Use

1. The preview section shows formatted text that you can interact with
2. Select any portion of text in the preview
3. Use the style controls on the left to modify the formatting:
   - Apply text styles (bold, italic, etc.)
   - Choose from basic or 256 colors for text and background
4. The raw ANSI codes are automatically generated in the textarea above the preview

## Planned Features (TODOs)

- [ ] Add copy button for raw ANSI codes
- [ ] Support for custom text input
- [ ] Export formatted text as various formats (HTML, RTF)
- [ ] Add more text styles (strikethrough, blink, etc.)
- [ ] Preview in different terminal color schemes
- [ ] Save and load formatting presets