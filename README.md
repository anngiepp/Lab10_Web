# Laboratorio 10 — Next.js: Rick and Morty

**Repositorio:** [github.com/anngiepp/Lab10_Web](https://github.com/anngiepp/Lab10_Web) · **App desplegada:** [lab10-web-peach.vercel.app](https://lab10-web-peach.vercel.app/)

Laboratorio académico con **Next.js 16.4.3**, React 19 y Tailwind 4 que reúne dos aplicaciones en un mismo proyecto:

- **Rick and Morty** (`/characters`) — laboratorio actual: catálogo de los 826 personajes con buscador, demostrando **SSG, ISR, SSR y CSR** sobre la [Rick and Morty API](https://rickandmortyapi.com/documentation/#character).
- **Pokédex** (`/pokemon`) — laboratorio anterior con la PokeAPI y la página original (`/`), conservados intactos.

## Rutas funcionales

| Ruta | Contenido | Estrategia |
| --- | --- | --- |
| `/` | Página principal original (intacta) | Estática |
| `/pokemon` | Lista de los 151 Pokémon | SSG + ISR (1 día) |
| `/pokemon/pikachu` (y los 151) | Detalle: número, tipos, estadísticas, habilidades | SSG + ISR (1 día) |
| `/pokemon/pokemon-inventado` | «Pokémon no encontrado» | 404 personalizada |
| `/characters` | **Catálogo completo de los 826 personajes** + buscador (nombre, estado, tipo, género) | SSG (HTML de 3,8 MB generado en build) + ISR (10 días) |
| `/characters/1` … `/characters/10` | Detalle por ID (Rick Sanchez, Morty Smith…) con todos los campos de la API | SSG + ISR (10 días) |
| `/characters/500`, `/characters/826` | IDs fuera del build: se generan en el primer acceso y quedan cacheados | SSR + ISR (10 días) |
| `/characters/name/Rick%20Sanchez` … (10 nombres) | Detalle por nombre | SSG + ISR (10 días) |
| `/characters/999999`, `/characters/name/Noexiste` | «¡Personaje no encontrado!» con enlace al catálogo | 404 personalizada |
| `/ruta-inexistente` | 404 global | 404 |

El **buscador funciona en el navegador (CSR)** sobre `/characters`: escribe un nombre o combina estado/tipo/género y consulta la API en tiempo real (debounce de 350 ms).

## Las cuatro estrategias en una frase cada una

- **SSG:** el catálogo, los 151 Pokémon, los 10 IDs y los 10 nombres se generan en `next build`.
- **ISR:** todo se revalida solo (10 días en `/characters`, 1 día en `/pokemon`).
- **SSR:** las rutas fuera del build se renderizan en el servidor en su primer acceso.
- **CSR:** solo el buscador, que debe reaccionar al teclado.

> Con `cacheComponents: true` (Next 16) la caché se declara con `"use cache"` + `cacheLife` en la capa de datos (`src/lib/rick-and-morty/api.ts`); `export const revalidate` daría error de build. El laboratorio de Pokémon no usa `cacheComponents` y sigue con `next: { revalidate }`.

## Ejecutar en local

```bash
git clone https://github.com/anngiepp/Lab10_Web
cd Lab10_Web
npm install
npm run dev
```

Abre **http://localhost:3000/characters**

## Evidencias

**Catálogo completo (826 personajes)**

![Catálogo con 826 personajes](./docs/evidencias/catalogo.png)

**Búsqueda por nombre (CSR)**

![Búsqueda por nombre](./docs/evidencias/busqueda-nombre.png)

**Filtros combinados (estado, tipo y género)**

![Filtros combinados](./docs/evidencias/filtros-combinados.png)

**Detalle por ID**

![Detalle por ID](./docs/evidencias/detalle-id.png)

**Detalle por nombre (Rick Sanchez)**

![Detalle por nombre](./docs/evidencias/detalle-nombre.png)

**Personaje inexistente (404 personalizada)**

![Personaje inexistente](./docs/evidencias/no-encontrado.png)

**Diseño responsive (móvil)**

![Diseño responsive](./docs/evidencias/responsive.png)

**Aplicación desplegada en Vercel**

![Despliegue en Vercel](./docs/evidencias/vercel.png)

## Verificación

| Prueba | Resultado |
| --- | --- |
| `npm run lint` / `npx tsc --noEmit` | 0 errores (4 warnings preexistentes de Pokémon) / sin errores de tipos |
| `npm run build` | **EXIT 0 en 31,8 s** · 180 páginas · `/characters` **○ Static** con `Revalidate 10d` |
| Producción local | `/characters` responde en **63 ms** con 826 enlaces e imágenes (HTML estático de 3,8 MB) |
| `npm run dev` | `/characters` carga los 826 personajes sin errores |
| Vercel | `/`, `/pokemon`, `/characters/1`, `/characters/500`, `/characters/name/Rick%20Sanchez` → **200** · `/characters/999999` → 404 personalizada · `/ruta-inexistente` → **404** |

## Despliegue

[https://lab10-web-peach.vercel.app/](https://lab10-web-peach.vercel.app/) — Vercel detecta Next.js automáticamente (sin configurar nada) y **cada push a `main`** genera un nuevo despliegue.

## Conclusiones

- `generateStaticParams` con una selección pequeña (10 IDs y 10 nombres) mantiene el build rápido; el resto de rutas se resuelve bajo demanda y se cachea con ISR.
- La API de Rick and Morty devuelve **429** con ráfagas en paralelo: el catálogo se recorre en secuencia con reintentos y espera creciente.
- Cada estrategia tiene un papel claro: SSG para lo estático, ISR para mantenerlo fresco, SSR bajo demanda y CSR solo donde hace falta reaccionar al usuario.
- Con `cacheComponents` la caché es explícita (`"use cache"` + `cacheLife`): entender cuándo se llena y cuándo se sirve fue lo más instructivo del laboratorio.

## Fuentes

[Rick and Morty API](https://rickandmortyapi.com/documentation/#character) · [Next.js](https://nextjs.org/docs) · [Vercel](https://vercel.com/docs)
