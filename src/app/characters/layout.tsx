import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { IoPlanet } from "react-icons/io5";

export const metadata: Metadata = {
  title: {
    default: "Rick and Morty",
    template: "%s · Rick and Morty",
  },
  description:
    "Catálogo de personajes de Rick and Morty con SSR, caché, ISR y buscador CSR",
};

interface CharactersLayoutProps {
  children: ReactNode;
}

export default function CharactersLayout({ children }: CharactersLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050e0a] text-white">
      {/* Luces difuminadas de fondo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-500/15 blur-[110px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-600/10 blur-[110px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-green-500/15 bg-black/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
          <Link
            href="/characters"
            className="text-xl font-bold text-white transition hover:text-green-300"
          >
            <IoPlanet size={26} className="inline-block text-green-400" />{" "}
            Rick and Morty
          </Link>

          <div className="ml-auto flex flex-wrap items-center gap-4 text-sm font-semibold">
            <Link
              href="/characters"
              className="text-slate-300 transition hover:text-green-300"
            >
              Catálogo
            </Link>
            <Link
              href="/pokemon"
              className="text-slate-300 transition hover:text-green-300"
            >
              Pokédex (lab)
            </Link>
            <Link
              href="/"
              className="text-slate-300 transition hover:text-green-300"
            >
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
