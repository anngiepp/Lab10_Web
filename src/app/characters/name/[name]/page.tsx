import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCharactersPage, getCharacterByName } from "@/lib/rick-and-morty/api";
import { CharacterDetail } from "@/components/characters/CharacterDetail";
import { CharacterDetailSkeleton } from "@/components/characters/CharactersSkeleton";

// Solo se prerenderizan los nombres únicos de los 10 personajes
// representativos de la primera página (1 petición cacheada compartida).
// Los demás nombres se resuelven bajo demanda.
export async function generateStaticParams() {
  const { results } = await getCharactersPage(1);
  const seen = new Set<string>();
  const params: { name: string }[] = [];

  for (const character of results) {
    if (character.id > 10) break;
    const key = character.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      params.push({ name: character.name });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const character = await getCharacterByName(name);

  if (!character) {
    return { title: "Personaje no encontrado" };
  }

  return {
    title: character.name,
    description: `${character.name} — ${character.status}, ${character.species}. Ficha de Rick and Morty por nombre.`,
  };
}

async function CharacterByName({ name }: { name: string }) {
  const character = await getCharacterByName(name);

  if (!character) {
    notFound();
  }

  return <CharacterDetail character={character} />;
}

export default function CharacterByNamePage(
  props: PageProps<"/characters/name/[name]">
) {
  return (
    <Suspense fallback={<CharacterDetailSkeleton />}>
      <CharacterByNameResolver params={props.params} />
    </Suspense>
  );
}

async function CharacterByNameResolver({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <CharacterByName name={decodeURIComponent(name)} />;
}
