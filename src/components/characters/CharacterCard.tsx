import Image from "next/image";
import Link from "next/link";
import { Character } from "@/types/character";

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  Alive: { dot: "bg-green-400", text: "text-green-300" },
  Dead: { dot: "bg-red-500", text: "text-red-300" },
  unknown: { dot: "bg-slate-400", text: "text-slate-300" },
};

const GENDER_LABELS: Record<string, string> = {
  Female: "♀ Hembra",
  Male: "♂ Macho",
  Genderless: "— Sin género",
  unknown: "? Desconocido",
};

export function CharacterCard({ character }: { character: Character }) {
  const status = STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown;

  return (
    <Link
      href={`/characters/${character.id}`}
      className="group block overflow-hidden rounded-2xl border border-green-500/20 bg-black/40 shadow-lg shadow-green-900/10 transition duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-green-400/20"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-green-950/40">
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-lg font-bold text-white transition group-hover:text-green-300">
            {character.name}
          </h2>
          <span className="shrink-0 text-xs font-semibold text-green-400/80">
            #{character.id.toString().padStart(3, "0")}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${status.dot}`}
            aria-hidden
          />
          <span className={`font-semibold ${status.text}`}>
            {character.status}
          </span>
          <span className="text-slate-500">·</span>
          <span className="truncate text-slate-300">{character.species}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
          {character.type ? (
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-green-300">
              {character.type}
            </span>
          ) : null}
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
            {GENDER_LABELS[character.gender] ?? character.gender}
          </span>
        </div>
      </div>
    </Link>
  );
}
