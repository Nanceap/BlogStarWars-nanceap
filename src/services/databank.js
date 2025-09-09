const DB_BASE = "https://starwars-databank-server.vercel.app/api/v1";

const RESOURCE_MAP = {
  people: "characters",
  planets: "locations",
  starships: "vehicles",
  vehicles: "vehicles",
  species: "species",
};


async function http(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Databank HTTP ${res.status}`);
  return res.json();
}


export async function getDbPage(swapiType, page = 1, limit = 20) {
  const r = RESOURCE_MAP[swapiType];
  if (!r) return { info: null, data: [] };
  const url = `${DB_BASE}/${r}?page=${page}&limit=${limit}`;
  return http(url);
}


export async function buildDbMediaMap(swapiType, maxPages = 10, limit = 20) {
  const map = new Map();
  const r = RESOURCE_MAP[swapiType];
  if (!r) return map;

  let page = 1;
  while (page <= maxPages) {
    const data = await getDbPage(swapiType, page, limit);
    (data?.data || []).forEach((it) => {
      if (!it?.name) return;
      map.set(it.name.toLowerCase(), {
        image: it.image || null,
        description: it.description || "",
      });
    });
    const next = data?.info?.next;
    if (!next) break;
    page++;
  }
  return map;
}
