"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMagnifyingGlass, FaXmark, FaSpinner } from "react-icons/fa6";
import { Character, CharacterListResponse } from "@/types/character";

const API_BASE = "https://rickandmortyapi.com/api/character";

const STATUS_OPTIONS = ["", "Alive", "Dead", "unknown"] as const;
const GENDER_OPTIONS = ["", "Female", "Male", "Genderless", "unknown"] as const;

export function CharacterSearch() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState<(typeof GENDER_OPTIONS)[number]>("");

  const [results, setResults] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const filtersActive =
    name.trim() !== "" || status !== "" || type.trim() !== "" || gender !== "";

  useEffect(() => {
    const active =
      name.trim() !== "" || status !== "" || type.trim() !== "" || gender !== "";

    // Sin filtros activos no se consulta la API; la UI de resultados
    // está oculta y el estado se limpia en clearFilters (evento).
    if (!active) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (name.trim()) params.set("name", name.trim());
      if (status) params.set("status", status);
      if (type.trim()) params.set("type", type.trim());
      if (gender) params.set("gender", gender);

      try {
        const res = await fetch(`${API_BASE}/?${params.toString()}`, {
          signal: controller.signal,
        });

        // La API responde 404 cuando no hay coincidencias
        if (res.status === 404) {
          setResults([]);
          setTotal(0);
          setSearched(true);
          return;
        }

        if (!res.ok) {
          throw new Error(`La API respondió con código ${res.status}`);
        }

        const data: CharacterListResponse = await res.json();
        setResults(data.results);
        setTotal(data.info.count);
        setSearched(true);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo conectar con la API de Rick and Morty"
        );
        setResults([]);
        setTotal(0);
        setSearched(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [name, status, type, gender]);

  const clearFilters = () => {
    setName("");
    setStatus("");
    setType("");
    setGender("");
    setResults([]);
    setTotal(0);
    setError(null);
    setSearched(false);
    setLoading(false);
  };

  return (
    <section aria-label="Buscador de personajes" className="mb-10">
      <div className="rounded-2xl border border-green-500/20 bg-black/40 p-5 shadow-lg shadow-green-900/10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <FaMagnifyingGlass className="text-green-400" />
          Buscador en tiempo real
          <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-green-400/70">
            CSR
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="rm-name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nombre
            </label>
            <input
              id="rm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rick, Morty..."
              className="w-full rounded-xl border border-green-500/30 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-green-400"
            />
          </div>

          <div>
            <label htmlFor="rm-status" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estado
            </label>
            <select
              id="rm-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full rounded-xl border border-green-500/30 bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-green-400"
            >
              <option value="">Todos</option>
              {STATUS_OPTIONS.filter(Boolean).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rm-type" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tipo
            </label>
            <input
              id="rm-type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Human, Robot..."
              className="w-full rounded-xl border border-green-500/30 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-green-400"
            />
          </div>

          <div>
            <label htmlFor="rm-gender" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Género
            </label>
            <select
              id="rm-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as typeof gender)}
              className="w-full rounded-xl border border-green-500/30 bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-green-400"
            >
              <option value="">Todos</option>
              {GENDER_OPTIONS.filter(Boolean).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtersActive ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {loading
                ? "Buscando..."
                : error
                  ? "Error en la búsqueda"
                  : `Resultado: ${total} coincidencia(s)`}
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
            >
              <FaXmark />
              Limpiar filtros
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Escribe un nombre o combina estado, tipo y género para buscar en la
            API (CSR).
          </p>
        )}
      </div>

      {filtersActive ? (
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-black/40 py-12 text-green-300">
              <FaSpinner className="animate-spin text-xl" />
              Consultando la API de Rick and Morty...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
              <p className="font-bold text-red-300">Error en la búsqueda</p>
              <p className="mt-1 text-sm text-red-200/80">{error}</p>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-6 text-center">
              <p className="font-bold text-yellow-300">
                Sin resultados en la dimensión
              </p>
              <p className="mt-1 text-sm text-yellow-200/80">
                Ningún personaje coincide con esos filtros.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((character) => (
                <Link
                  key={character.id}
                  href={`/characters/${character.id}`}
                  className="group block overflow-hidden rounded-2xl border border-green-500/20 bg-black/40 transition hover:-translate-y-1 hover:border-green-400/60"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-green-950/40">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="truncate font-bold text-white group-hover:text-green-300">
                      {character.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {character.status} · {character.species}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
