import type { ScriptCharacter } from "botc-script-checker";

// Character types needed by the component
export type CharacterTeam =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled";

export type ResolvedCharacter = ScriptCharacter & {
  wiki_image?: string;
  edition?: string;
  isCustom?: boolean;
};

export interface GroupedCharacters {
  townsfolk: ResolvedCharacter[];
  outsider: ResolvedCharacter[];
  minion: ResolvedCharacter[];
  demon: ResolvedCharacter[];
  traveller: ResolvedCharacter[];
  fabled: ResolvedCharacter[];
}

export interface Jinx {
  characters: [string, string];
  jinx: string;
  oldJinx?: string;
}

export type NightMarker = "dawn" | "dusk" | "minioninfo" | "demoninfo";
export type NightOrderEntry = ResolvedCharacter | NightMarker;
