// Character types needed by the component
export type CharacterTeam =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled";

export interface ResolvedCharacter {
  id: string;
  name: string;
  ability: string;
  team: CharacterTeam;
  image?: string | string[];
  wiki_image?: string;
  edition?: string;
  isCustom?: boolean;
}

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
