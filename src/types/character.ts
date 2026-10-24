export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterListResponse {
  info: CharacterInfo;
  results: Character[];
}

export type CharacterFilters = {
  name: string;
  status: "" | "Alive" | "Dead" | "unknown";
  type: string;
  gender: "" | "Female" | "Male" | "Genderless" | "unknown";
};
