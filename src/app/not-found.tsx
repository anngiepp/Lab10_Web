import type { Metadata } from "next";
import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d1b] px-6 py-12 text-white">
      {/* Luces decorativas */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full border-4 border-yellow-400/30 bg-yellow-500/10 shadow-[0_0_50px_rgba(250,204,21,0.15)]">
          <FaSearch className="text-4xl text-yellow-300" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Error 404
        </p>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          404
          <span className="mt-2 block text-yellow-300">
            Página no encontrada
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
          La ruta que buscas no existe o ha cambiado de lugar.
          ¡Volvamos a la aventura!
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/pokemon"
            className="flex items-center justify-center gap-3 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-black shadow-lg shadow-yellow-400/20 transition hover:-translate-y-1 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            <FaSearch />
            Explorar Pokédex
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
          >
            <FaHome />
            Regresar al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
