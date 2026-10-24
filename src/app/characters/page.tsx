import { Metadata } from "next";
import { FaDatabase } from "react-icons/fa6";
import { getAllCharacters, getAllCharactersDev } from "@/lib/rick-and-morty/api";
import { CharactersGrid } from "@/components/characters/CharactersGrid";
import { CharacterSearch } from "@/components/characters/CharacterSearch";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Los 826 personajes de Rick and Morty, renderizados en el servidor (SSG + ISR con revalidación cada 10 días).",
};

// Catálogo prerenderizado en build (SSG): sin Suspense y con los datos en
// "use cache", el HTML completo de los 826 personajes se empaqueta en el
// build y se sirve desde CDN. En desarrollo se usa la versión sin caché
// (getAllCharactersDev) porque el detector de colgados del dev server
// interpreta un fill largo como un error de deadlock.
async function CharactersCatalog() {
  const characters = await (process.env.NODE_ENV === "development"
    ? getAllCharactersDev()
    : getAllCharacters());

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

      <CharactersCatalog />
    </>
  );
}
