import type { ScriptCharacter, ScriptMetadata } from "botc-script-checker";

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

export interface NightOrders {
  first: NightOrderEntry[];
  other: NightOrderEntry[];
}

export interface ScriptOptions {
  color: string;
  showAuthor: boolean;
  showJinxes: boolean;
  useOldJinxes: boolean;
  showSwirls: boolean;
  includeMargins: boolean;
  solidTitle: boolean;
  appearance: "normal" | "compact" | "super-compact";
  showBackingSheet: boolean;
  showNightSheet: boolean;
  iconScale: number;
  formatMinorWords: boolean;
  displayNightOrder: boolean;
}

export interface ParsedScript {
  metadata: ScriptMetadata | null;
  characters: ScriptCharacter[];
}

export type NetworkPayload = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
  filename: string;
};
