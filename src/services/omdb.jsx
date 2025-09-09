const OMDB = "https://www.omdbapi.com/";

export async function fetchMovieData(title) {
  try {
    const key = import.meta.env.VITE_OMDB_KEY;
    if (!key) return null;
    const url = `${OMDB}?apikey=${key}&t=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.Response === "False") return null;
    const poster = json.Poster && json.Poster !== "N/A" ? json.Poster : null;
    return {
      title: json.Title,
      poster,
      plot: json.Plot !== "N/A" ? json.Plot : "",
      year: json.Year,
    };
  } catch {
    return null;
  }
}

