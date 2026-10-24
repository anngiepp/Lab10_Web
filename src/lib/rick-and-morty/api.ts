import { cacheLife } from "next/cache";
import { Character, CharacterListResponse } from "@/types/character";

const API_BASE = "https://rickandmortyapi.com/api";

// Revalida la caché de datos cada 10 días (864000 segundos).
// Perfil compatible con cacheComponents: sin export const revalidate.
const TEN_DAYS = { revalidate: 864000 };

// La API de Rick and Morty responde 429 cuando llegan muchas peticiones
// (el build usa varios workers en paralelo). Reintenta con backoff.
async function fetchWithRetry(url: string, attempts = 6): Promise<Response> {
  let res = await fetch(url);
  let attempt = 0;

  while (res.status === 429 && attempt < attempts) {
    attempt += 1;
    // Espera creciente pero con tope de 10 s para no acumular más de ~34 s
    // por página (el build y Vercel tienen presupuesto de tiempo limitado).
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(1000 * 2 ** attempt, 10000))
    );
    res = await fetch(url);
  }

  return res;
}

// Una página de la API (20 personajes). Entrada de caché por número de
// página: la comparten el catálogo, generateStaticParams y sus renders.
export async function getCharactersPage(
  page: number
): Promise<CharacterListResponse> {
  "use cache";
  cacheLife(TEN_DAYS);

  const res = await fetchWithRetry(`${API_BASE}/character?page=${page}`);

  if (!res.ok) {
    throw new Error(`Error al cargar la página ${page} (${res.status})`);
  }

  return res.json();
}

// Recorre toda la paginación de la API (42 páginas, 826 personajes)
// reutilizando las entradas cacheadas de getCharactersPage. Secuencial y
// con pausa: la API responde 429 ante ráfagas en paralelo (probado).
async function collectAllCharacters(): Promise<Character[]> {
  const characters: Character[] = [];
  let page = 1;
  let pages = 1;

  do {
    const data = await getCharactersPage(page);
    characters.push(...data.results);
    pages = data.info.pages;
    page += 1;

    if (page <= pages) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } while (page <= pages);

  return characters;
}

// Versión para `next dev`: sin "use cache". El dev server tiene un detector
// de colgados que lanza UseCacheDeadlockError si un fill tarda más de 10 s
// sin emitir nada (el error «Falló la comunicación con la dimensión»). Un
// recorrido de 42 páginas siempre lo superaría, así que en desarrollo el
// ensamblaje queda fuera de la caché y cada página se cachea por separado.
export function getAllCharactersDev(): Promise<Character[]> {
  return collectAllCharacters();
}

// Versión para build y producción: con "use cache". Durante `next build` el
// fill se ejecuta una vez, se almacena y el HTML completo de los 826
// personajes se empaqueta como página estática; en Vercel se sirve desde CDN
// sin tocar la API en cada request (y si la revalidación falla, se sirve el
// contenido anterior).
export async function getAllCharacters(): Promise<Character[]> {
  "use cache";
  cacheLife(TEN_DAYS);
  return collectAllCharacters();
}

// Fetch directo por ID (1 petición). Las rutas no listadas en
// generateStaticParams se resuelven bajo demanda con esta función.
export async function getCharacterById(id: number): Promise<Character | null> {
  "use cache";
  cacheLife(TEN_DAYS);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const res = await fetchWithRetry(`${API_BASE}/character/${id}`);

  // El personaje no existe
  if (res.status === 404) {
    return null;
  }

  // Fallo temporal de red o del servidor: lo captura error.tsx
  if (!res.ok) {
    throw new Error(`Error al cargar el personaje (${res.status})`);
  }

  return res.json();
}

// Fetch directo por nombre (case-insensitive, primera coincidencia, igual
// que la API). Los nombres duplicados resuelven al primer personaje.
export async function getCharacterByName(
  name: string
): Promise<Character | null> {
  "use cache";
  cacheLife(TEN_DAYS);

  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const res = await fetchWithRetry(
    `${API_BASE}/character/?name=${encodeURIComponent(trimmed)}`
  );

  // La API responde 404 cuando no hay coincidencias
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error al buscar el personaje (${res.status})`);
  }

  const data: CharacterListResponse = await res.json();

  return data.results[0] ?? null;
}
