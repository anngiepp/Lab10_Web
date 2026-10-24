import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaBolt, FaHeart, FaWeightHanging, FaRulerVertical } from "react-icons/fa6";
import { Pokemon, PokemonListResponse, PokemonType } from "@/types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-orange-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-600",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-slate-500",
  fairy: "bg-pink-400",
};

const MAX_STAT = 255;

async function getPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 86400 }, // Revalida cada 24 horas, igual que la lista
  });

  // El Pokémon no existe: muestra la 404 personalizada del segmento
  if (res.status === 404) {
    notFound();
  }

  // Fallo temporal de red o del servidor: lo captura error.tsx
  if (!res.ok) {
    throw new Error(`Error al cargar el Pokémon (${res.status})`);
  }

  return res.json();
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Genera parámetros estáticos para los primeros 151 Pokémon (SSG + ISR)
export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 }, // Misma URL/opciones que la lista: reutiliza el caché
  });

  if (!res.ok) {
    throw new Error(`Error al cargar la lista de Pokémon (${res.status})`);
  }

  const data: PokemonListResponse = await res.json();

  return data.results.map((pokemon) => ({ name: pokemon.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  // Mismo fetch que la página: Next.js lo memoiza y no se duplica la petición
  const pokemon = await getPokemon(name);

  const displayName = capitalize(pokemon.name);
  const number = pokemon.id.toString().padStart(3, "0");
  const types = pokemon.types.map((type) => type.type.name).join(", ");

  return {
    title: `${displayName} · Pokédex`,
    description: `${displayName} (N.º ${number}) — Tipo: ${types}. Estadísticas base, altura, peso y habilidades.`,
  };
}

function TypeBadge({ type }: { type: PokemonType }) {
  const color = TYPE_COLORS[type.type.name] ?? "bg-slate-500";

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide text-white ${color}`}
    >
      {type.type.name}
    </span>
  );
}

function StatBar({ name, value }: { name: string; value: number }) {
  const percentage = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold uppercase tracking-wide text-slate-300">
          {name}
        </span>
        <span className="font-bold text-yellow-300">{value}</span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-yellow-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

async function PokemonDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const pokemon = await getPokemon(name);

  const artwork =
    pokemon.sprites.other["official-artwork"].front_default;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/pokemon"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
        >
          <FaArrowLeft />
          Volver a la Pokédex
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="relative flex h-64 w-64 shrink-0 items-center justify-center rounded-full border-4 border-yellow-400/30 bg-yellow-400/10 shadow-[0_0_50px_rgba(250,204,21,0.15)] sm:h-72 sm:w-72">
              {artwork ? (
                <Image
                  src={artwork}
                  alt={pokemon.name}
                  width={280}
                  height={280}
                  priority
                  className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              ) : (
                <span className="text-6xl font-black text-yellow-300">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
              )}
            </div>

            <div className="w-full flex-1 text-center md:text-left">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
                N.º {pokemon.id.toString().padStart(3, "0")}
              </p>

              <h1 className="mt-2 text-4xl font-black capitalize tracking-tight text-white sm:text-5xl">
                {pokemon.name}
              </h1>

              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.slot} type={type} />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <FaRulerVertical className="mx-auto text-yellow-400" />
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Altura
                  </p>
                  <p className="font-bold text-white">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <FaWeightHanging className="mx-auto text-yellow-400" />
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Peso
                  </p>
                  <p className="font-bold text-white">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <FaBolt className="mx-auto text-yellow-400" />
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Experiencia
                  </p>
                  <p className="font-bold text-white">
                    {pokemon.base_experience ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <FaBolt className="text-yellow-400" />
                Estadísticas base
              </h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    name={stat.stat.name.replace("-", " ")}
                    value={stat.base_stat}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <FaHeart className="text-yellow-400" />
                Habilidades
              </h2>
              <ul className="space-y-2">
                {pokemon.abilities.map((ability) => (
                  <li
                    key={ability.ability.name}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="font-semibold capitalize text-white">
                      {ability.ability.name.replace("-", " ")}
                    </span>
                    {ability.is_hidden && (
                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold uppercase text-purple-300">
                        Oculta
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonDetailSkeleton() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-8 h-12 w-56 rounded-xl border border-white/10 bg-white/5" />
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="h-64 w-64 shrink-0 rounded-full bg-white/5 sm:h-72 sm:w-72" />
            <div className="w-full flex-1 space-y-4">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-10 w-48 rounded bg-white/10" />
              <div className="flex gap-2">
                <div className="h-8 w-20 rounded-full bg-white/10" />
                <div className="h-8 w-20 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PokemonPage(props: PageProps<"/pokemon/[name]">) {
  return (
    <Suspense fallback={<PokemonDetailSkeleton />}>
      <PokemonDetail params={props.params} />
    </Suspense>
  );
}
