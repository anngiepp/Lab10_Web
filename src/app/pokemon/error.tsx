
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaBolt, FaRedo, FaHome } from "react-icons/fa";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d1b] px-6 py-12 text-white">
      {/* Luces decorativas */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-500/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full border-4 border-red-400/30 bg-red-500/10 shadow-[0_0_50px_rgba(248,113,113,0.15)]">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white">
            <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 bg-white" />
            <div className="z-10 h-6 w-6 rounded-full border-4 border-white bg-[#080d1b]" />
          </div>
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-red-400">
          Error 500 · Pokédex
        </p>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          ¡Oh, no!
          <span className="mt-2 block text-red-400">
            Algo salió mal.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
          Parece que nuestros Pokémon se han perdido en otra dimensión.
          No pudimos cargar los datos. ¡Intentemos de nuevo!
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-3 rounded-xl bg-red-500 px-7 py-4 font-bold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <FaRedo />
            Intentar nuevamente
          </button>

          <Link
            href="/pokemon"
            className="flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
          >
            <FaHome />
            Volver a la Pokédex
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Entrenador, tu aventura aún no termina.</span>
        </div>
      </section>
    </main>
  );
}
