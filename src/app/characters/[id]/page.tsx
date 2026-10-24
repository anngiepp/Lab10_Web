import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCharactersPage, getCharacterById } from "@/lib/rick-and-morty/api";
import { CharacterDetail } from "@/components/characters/CharacterDetail";
import { CharacterDetailSkeleton } from "@/components/characters/CharactersSkeleton";

// Solo se prerenderizan 10 IDs representativos (build rápido para el lab),
// tomados de la primera página de la API (1 petición cacheada compartida).
// El resto de IDs se resuelven bajo demanda (App Shell + upgrade ISR).
export async function generateStaticParams() {
  const { results } = await getCharactersPage(1);
  return results
    .filter((character) => character.id <= 10)
    .map((character) => ({ id: String(character.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacterById(Number(id));

  if (!character) {
    return { title: "Personaje no encontrado" };
  }

  return {
    title: character.name,
    description: `${character.name} — ${character.status}, ${character.species}. Ficha completa de Rick and Morty.`,
  };
}

async function CharacterById({ id }: { id: string }) {
  const numericId = Number(id);
  const character = await getCharacterById(numericId);

  if (!character) {
    notFound();
  }

  return <CharacterDetail character={character} />;
}

export default function CharacterByIdPage(props: PageProps<"/characters/[id]">) {
  return (
    <Suspense fallback={<CharacterDetailSkeleton />}>
      <CharacterByIdResolver params={props.params} />
    </Suspense>
  );
}

async function CharacterByIdResolver({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CharacterById id={id} />;
}
