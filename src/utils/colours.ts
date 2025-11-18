import { CharacterTeam } from "botc-script-checker";

export function parseRgb(hex: string): [number, number, number] {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

export function rgbString(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function darken(color: string, darkenFactor: number) {
  const [r, g, b] = parseRgb(color);
  const rDark = Math.round(r * darkenFactor);
  const gDark = Math.round(g * darkenFactor);
  const bDark = Math.round(b * darkenFactor);
  return rgbString(rDark, gDark, bDark);
}

export const teamColours: Record<CharacterTeam, string> = {
  townsfolk: "#00469e",
  outsider: "#00469e",
  minion: "#580709",
  demon: "#580709",
  fabled: "#6b5f05ff",
  traveller: "#390758ff",
  loric: "#1f5807",
};
