import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
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

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-green-500/20 bg-black/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-green-400/80">
        {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

function episodeNumber(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || "?";
}

export function CharacterDetail({ character }: { character: Character }) {
  const status = STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown;
  const created = new Date(character.created).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto w-full max-w-5xl">
      <Link
        href="/characters"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-300 transition hover:text-green-200"
      >
        <FaArrowLeft />
        Volver al catálogo
      </Link>

      <div className="rounded-3xl border border-green-500/20 bg-black/40 p-6 shadow-xl shadow-green-900/10 sm:p-10">
        <div className="grid gap-8 md:grid-cols-[320px,1fr]">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-green-500/30 bg-green-950/40">
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-green-400/80">
              N.º {character.id.toString().padStart(3, "0")}
            </p>
            <h1 className="mt-1 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {character.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
                <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} aria-hidden />
                <span className={`font-bold ${status.text}`}>
                  {character.status}
                </span>
              </span>
              <span className="text-slate-400">
                {GENDER_LABELS[character.gender] ?? character.gender}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DataField label="Especie" value={character.species} />
              <DataField label="Tipo" value={character.type} />
              <DataField label="Origen" value={character.origin.name} />
              <DataField label="Ubicación actual" value={character.location.name} />
              <DataField label="Creado" value={created} />
              <DataField
                label="Episodios"
                value={`${character.episode.length} episodio(s)`}
              />
            </div>

            {character.origin.url ? (
              <p className="mt-3 break-all text-xs text-slate-500">
                Origen (API):{" "}
                <a
                  href={character.origin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400/80 underline hover:text-green-300"
                >
                  {character.origin.url}
                </a>
              </p>
            ) : null}

            {character.episode.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-green-400/80">
                  Episodios
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {character.episode.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={url}
                      className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-300 transition hover:bg-green-500/20"
                    >
                      EP {episodeNumber(url)}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="mt-6 break-all text-xs text-slate-500">
              URL (API):{" "}
              <a
                href={character.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400/80 underline hover:text-green-300"
              >
                {character.url}
              </a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
