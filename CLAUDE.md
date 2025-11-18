# botc-character-sheet

A reusable Preact component library for rendering Blood on the Clocktower character sheets with a beautiful parchment theme.

## Project Overview

This is a TypeScript-based Preact component library designed to create printable character sheets for Blood on the Clocktower custom scripts. The library provides two main components: `CharacterSheet` (front page) and `SheetBack` (backing page), both styled with a vintage parchment aesthetic.

**Key Features:**
- Beautiful parchment-themed character sheets
- Support for all character types (Townsfolk, Outsiders, Minions, Demons, Travellers, Fabled)
- Jinx relationship display with character icons
- Night order visualization on back sheet
- Customizable colors, appearance modes (normal/compact/super-compact), and styling options
- Print-ready with optional margins
- Built as an ES module for easy integration

## Project Structure

```
botc-character-sheet/
├── src/
│   ├── CharacterSheet.tsx       # Main front sheet component
│   ├── CharacterSheet.css       # Styles for front sheet
│   ├── SheetBack.tsx           # Back sheet component
│   ├── SheetBack.css           # Styles for back sheet
│   ├── types.ts                # TypeScript type definitions
│   ├── index.ts                # Main package exports
│   ├── colorAlgorithms.ts      # Color manipulation utilities
│   └── utils/
│       └── minorWordFormatter.tsx  # Text formatting utilities
├── dist/                       # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Tech Stack

- **Framework**: Preact 10.19.3
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.0.8
- **Package Manager**: Bun
- **Dependencies**: botc-script-checker ^0.1.1

## Component Architecture

### CharacterSheet Component

Located at: `src/CharacterSheet.tsx:19-127`

The main component that renders the character sheet front page.

**Props:**
```typescript
interface CharacterSheetProps {
  title: string;                    // Script title
  author?: string;                  // Script author name
  characters: GroupedCharacters;    // Characters grouped by team
  color: string;                    // Theme color (default: "#4a5568")
  jinxes: Jinx[];                  // Array of jinx relationships
  showSwirls?: boolean;            // Show decorative swirls (default: true)
  includeMargins?: boolean;        // Add margins for printing (default: false)
  solidTitle?: boolean;            // Use solid title background (default: false)
  iconScale?: number;              // Scale character icons (default: 1.6)
  appearance?: "normal" | "compact" | "super-compact"; // Layout density
}
```

**Sub-components:**
- `Header` (src/CharacterSheet.tsx:130-168): Renders the title with optional decorative swirls
- `Sidebar` (src/CharacterSheet.tsx:170-177): Renders the colored sidebar
- `CharacterSection` (src/CharacterSheet.tsx:188-228): Renders a team section with characters in two columns
- `CharacterCard` (src/CharacterSheet.tsx:237-311): Renders individual character cards with icon, name, and ability
- `JinxesSection` (src/CharacterSheet.tsx:318-405): Renders jinx relationships with character icons

### SheetBack Component

Located at: `src/SheetBack.tsx:15-80`

Renders the backing sheet for double-sided printing with optional night order.

**Props:**
```typescript
type SheetBackProps = {
  title: string;                    // Script title
  color: string;                    // Theme color
  includeMargins: boolean;          // Add margins for printing
  formatMinorWords?: boolean;       // Format minor words (default: false)
  displayNightOrder?: boolean;      // Show night order (default: false)
  firstNightOrder?: NightOrderEntry[];  // First night order
  otherNightOrder?: NightOrderEntry[];  // Other nights order
}
```

## Type Definitions

Located at: `src/types.ts`

**Core Types:**
```typescript
type CharacterTeam = "townsfolk" | "outsider" | "minion" | "demon" | "traveller" | "fabled";

type ResolvedCharacter = ScriptCharacter & {
  wiki_image?: string;
  edition?: string;
  isCustom?: boolean;
};

interface GroupedCharacters {
  townsfolk: ResolvedCharacter[];
  outsider: ResolvedCharacter[];
  minion: ResolvedCharacter[];
  demon: ResolvedCharacter[];
  traveller: ResolvedCharacter[];
  fabled: ResolvedCharacter[];
}

interface Jinx {
  characters: [string, string];
  jinx: string;
  oldJinx?: string;
}

type NightMarker = "dawn" | "dusk" | "minioninfo" | "demoninfo";
type NightOrderEntry = ResolvedCharacter | NightMarker;
```

## Build Configuration

### Vite Configuration (vite.config.ts)

The project is configured to build as a library:
- Entry point: `src/index.ts`
- Output format: ES modules only
- Externalizes peer dependencies (preact, preact/hooks)
- CSS extracted to separate file
- TypeScript declarations generated

### TypeScript Configuration (tsconfig.json)

- Target: ES2020
- Module: ESNext
- JSX: react-jsx with Preact import source
- Strict mode enabled
- Declaration files generated with source maps

## Development Workflow

### Scripts

```bash
# Build the library
bun run build

# Build in watch mode for development
bun run dev

# Publish (requires build first)
bun run publish
```

### Build Process

The build script runs two commands:
1. `vite build` - Bundles JavaScript/CSS
2. `tsc --emitDeclarationOnly --outDir dist` - Generates TypeScript declarations

## Styling System

The components use CSS custom properties for theming:
- `--header-color-light`: Main theme color
- `--header-color-dark`: Darkened version of theme color

The parchment background image is expected at: `/images/parchment_texture_a4_lightened.jpg`

Additional image assets needed:
- `/images/black-swirl-divider.png` - Header decoration
- `/images/divider.png` - Section dividers
- `/images/dawn-icon.png` - Night order marker
- `/images/dusk-icon.png` - Night order marker
- `/images/minioninfo.png` - Night order marker
- `/images/demoninfo.png` - Night order marker

## Key Features Implementation

### Character Icons

Located at: `src/CharacterSheet.tsx:243-257`

The component handles multiple image source priorities:
1. `wiki_image` (for official characters)
2. `image` (string or array, for custom characters)
3. Fallback to letter placeholder using first character of name

### Ability Text Formatting

Located at: `src/CharacterSheet.tsx:259-274`

Setup abilities in square brackets at the end of ability text are automatically styled with bold formatting.

### Jinx Display

Located at: `src/CharacterSheet.tsx:318-405`

- Automatically switches between single and two-column layout based on jinx count (>4)
- Shows character icons with jinx descriptions
- Falls back to character name initials if no icon available

### Night Order

Located at: `src/SheetBack.tsx:82-98`

Supports displaying character order for first night and other nights, including special markers (dawn, dusk, minioninfo, demoninfo).

### Minor Word Formatting

Located at: `src/utils/minorWordFormatter.tsx`

Special formatting utility for proper title case handling with minor words.

## Version History

- **0.9.0** (current): Latest improvements to section title spacing
- **0.8.1**: Enhanced minor word formatting and night order display
- **0.7.0**: Major feature additions
- **0.5.0**: Column layout updates
- **0.4.0**: CSS refinements
- Initial release: Basic component structure

## Package Distribution

The package is published with:
- ES module entry point: `./dist/index.js`
- TypeScript types: `./dist/index.d.ts`
- Separate CSS export: `./dist/style.css`
- Only `dist/` folder included in npm package

## Usage Example

```tsx
import { CharacterSheet, SheetBack } from 'botc-character-sheet';
import 'botc-character-sheet/style.css';

function App() {
  const characters = {
    townsfolk: [/* ... */],
    outsider: [/* ... */],
    minion: [/* ... */],
    demon: [/* ... */],
    traveller: [],
    fabled: [],
  };

  const jinxes = [
    {
      characters: ['character1', 'character2'],
      jinx: 'Jinx description here'
    }
  ];

  return (
    <>
      <CharacterSheet
        title="My Custom Script"
        author="John Doe"
        characters={characters}
        color="#137415"
        jinxes={jinxes}
        showSwirls={true}
        solidTitle={false}
        iconScale={1.6}
        appearance="normal"
      />
      <SheetBack
        title="My Custom Script"
        color="#137415"
        includeMargins={false}
        displayNightOrder={true}
        firstNightOrder={[/* ... */]}
        otherNightOrder={[/* ... */]}
      />
    </>
  );
}
```

## Attribution

The component includes attribution footer:
- © Steven Medway bloodontheclocktower.com
- Script template by John Forster ravenswoodstudio.xyz

## License

MIT
