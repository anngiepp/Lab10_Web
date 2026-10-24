import { Suspense } from "react";
import { Metadata } from "next";
import { FaDatabase } from "react-icons/fa6";
import { getAllCharacters } from "@/lib/rick-and-morty/api";
import { CharactersGrid } from "@/components/characters/CharactersGrid";
import { CharactersSkeleton } from "@/components/characters/CharactersSkeleton";
import { CharacterSearch } from "@/components/characters/CharacterSearch";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Los 826 personajes de Rick and Morty, renderizados en el servidor (SSG + ISR con revalidación cada 10 días).",
};

// Catálogo renderizado en el servidor: se prerenderiza en build y se
// revalida cada 864000 s (10 días) porque las páginas que ensambla
// getAllCharacters tienen "use cache" con cacheLife(10 días).
async function CharactersCatalog() {
  const characters = await getAllCharacters();

  return (
    <section aria-label="Catálogo completo">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <FaDatabase className="text-green-400" />
          Catálogo completo · {characters.length} personajes
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-green-400/70">
          SSR · caché 10 días (864000 s)
        </p>
      </div>

      <CharactersGrid characters={characters} />
    </section>
  );
}

export default function CharactersPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Personajes de{" "}
          <span className="text-green-400">Rick and Morty</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Catálogo del lado del servidor con datos cacheados y revalidación
          automática cada 10 días, más un buscador en tiempo real en el
          navegador (CSR).
        </p>
      </header>

      <CharacterSearch />

      <Suspense fallback={<CharactersSkeleton count={12} />}>
        <CharactersCatalog />
      </Suspense>
    </>
  );
}
