import Link from "next/link";
import { FaSearch, FaHome } from "react-icons/fa";

export default function CharactersNotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-green-500/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-[100px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-green-500/20 bg-black/50 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full border-4 border-green-400/30 bg-green-500/10">
          <FaSearch className="text-4xl text-green-300" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-green-400">
          Error 404 · Rick and Morty
        </p>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          404
          <span className="mt-2 block text-green-300">
            ¡Personaje no encontrado!
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
          Ese personaje no existe en esta dimensión (o aún no ha sido
          registrado en la API). ¡Probablemente fue borrado por el Consejo de
          Ricks!
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/characters"
            className="flex items-center justify-center gap-3 rounded-xl bg-green-500 px-7 py-4 font-bold text-black shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <FaSearch />
            Explorar el catálogo
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
