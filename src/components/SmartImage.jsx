import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../store.jsx";
import { fetchMovieData } from "../services/omdb";

const typeToVgDir = {
  people: "characters",
  planets: "planets",
  starships: "starships",
  vehicles: "vehicles",
  species: "species",
  films: "films",
};

const IMG_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const memImg = new Map();

function ssGet(key) {
  try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function ssSet(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function preload(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

export default function SmartImage({ type, uid, name, alt }) {
  const { store } = useContext(Context);
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  const mediaMap = store.mediaMaps?.[type] || new Map();
  const media = name ? mediaMap.get((name || "").toLowerCase()) : null;
  const dbImage = media?.image || null;
  const vgUrl = uid ? `https://starwars-visualguide.com/assets/img/${typeToVgDir[type] || type}/${uid}.jpg` : null;

  const cacheKey = useMemo(() => `img:${type}:${uid}:${name || ""}`, [type, uid, name]);

  const candidates = useMemo(() => {
    const arr = [];
    if (dbImage) arr.push(dbImage);
    if (vgUrl) arr.push(vgUrl);
    return arr;
  }, [dbImage, vgUrl]);

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();

    const load = async () => {
      setLoading(true);

      // cache en memoria
      const memHit = memImg.get(cacheKey);
      if (memHit && (now - memHit.ts) < IMG_TTL_MS) {
        if (!cancelled) { setSrc(memHit.url); setLoading(false); }
        return;
      }

      // cache en sessionStorage
      const ssHit = ssGet(cacheKey);
      if (ssHit && (now - ssHit.ts) < IMG_TTL_MS) {
        memImg.set(cacheKey, ssHit);
        if (!cancelled) { setSrc(ssHit.url); setLoading(false); }
        return;
      }

      // candidatos locales
      for (const url of candidates) {
        try {
          await preload(url);
          if (cancelled) return;
          setSrc(url); setLoading(false);
          const payload = { ts: now, url };
          memImg.set(cacheKey, payload);
          ssSet(cacheKey, payload);
          return;
        } catch {}
      }

      // fallback OMDb solo films
      if (type === "films" && name) {
        const data = await fetchMovieData(name);
        const poster = data?.poster || null;
        if (poster) {
          try {
            await preload(poster);
            if (cancelled) return;
            setSrc(poster); setLoading(false);
            const payload = { ts: now, url: poster };
            memImg.set(cacheKey, payload);
            ssSet(cacheKey, payload);
            return;
          } catch {}
        }
      }

      if (!cancelled) { setSrc(null); setLoading(false); }
    };

    load();
    return () => { cancelled = true; };
  }, [cacheKey, candidates, type, name]);

  return (
    <div className={`ratio-16x9 img-wrapper ${loading ? "is-loading" : ""}`}>
      {loading && <div className="img-skeleton" />}
      {src ? (
        <img
          src={src}
          alt={alt || name || ""}
          className={`img-cover ${loading ? "img-blur" : ""}`}
          onLoad={(e) => e.currentTarget.classList.remove("img-blur")}
          loading="eager"
          decoding="async"
        />
      ) : (
        !loading && (
          <div className="img-fallback">
            <i className="fas fa-image"></i>
          </div>
        )
      )}
    </div>
  );
}


