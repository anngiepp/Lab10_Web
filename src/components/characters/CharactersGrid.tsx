import { Character } from "@/types/character";
import { CharacterCard } from "./CharacterCard";

export function CharactersGrid({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
