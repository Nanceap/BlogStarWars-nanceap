// src/services/omdb.js
const OMDB = "https://www.omdbapi.com/";
const OMDB_TTL_MS = 24 * 60 * 60 * 1000; // 1 día
const memOmdb = new Map(); // cache en memoria para la sesión

function ssGet(key) {
  try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function ssSet(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
}


export async function fetchMovieData(title) {
  const key = import.meta.env.VITE_OMDB_KEY;
  if (!key) return null;

  const cacheKey = `omdb:${title}`;
  const now = Date.now();

  // 1) memoria
  if (memOmdb.has(cacheKey)) return memOmdb.get(cacheKey);

  // 2) sessionStorage + TTL
  const cached = ssGet(cacheKey);
  if (cached && (now - cached.ts) < OMDB_TTL_MS) {
    memOmdb.set(cacheKey, cached.data);
    return cached.data;
  }

  // 3) fetch
  try {
    const url = `${OMDB}?apikey=${key}&t=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.Response === "False") return null;

    const data = {
      title: json.Title,
      poster: json.Poster && json.Poster !== "N/A" ? json.Poster : null,
      plot: json.Plot !== "N/A" ? json.Plot : "",
      year: json.Year,
    };

    memOmdb.set(cacheKey, data);
    ssSet(cacheKey, { ts: now, data });

    return data;
  } catch {
    return null;
  }
}


