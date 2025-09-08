import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store.jsx";

const typeToImageDir = {
  people: "characters",
  planets: "planets",
  starships: "starships",
  vehicles: "vehicles",
  species: "species",
  films: "films",
};

const labelByType = {
  people: "Characters",
  planets: "Planets",
  starships: "Starships",
  vehicles: "Vehicles",
  species: "Species",
  films: "Films",
};

const Card = ({ item, type, compact = false }) => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [desc, setDesc] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(true);

  const imgDir = typeToImageDir[type] || type;
  const imageUrl = `https://starwars-visualguide.com/assets/img/${imgDir}/${item.uid}.jpg`;

  // Cargar descripción desde el detalle de SWAPI
  useEffect(() => {
    let active = true;
    setLoadingDesc(true);
    fetch(`https://www.swapi.tech/api/${type}/${item.uid}`)
      .then(r => r.json())
      .then(data => {
        if (!active) return;
        const d = data?.result?.description || "";
        setDesc(d);
      })
      .catch(() => { if (active) setDesc(""); })
      .finally(() => { if (active) setLoadingDesc(false); });
    return () => { active = false; };
  }, [type, item.uid]);

  return (
    <div className={`card card--dark ${compact ? "card--list" : ""}`}>
      {/* Imagen / Placeholder */}
      <div className={`card__thumb ${compact ? "card__thumb--list" : ""}`}>
        {!imgError ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-100 h-100"
            style={{ objectFit: "cover", display: "block" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100 text-muted bg-secondary">
            <i className="fas fa-image fa-2x"></i>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <h5 className="card-title mb-1">{item.name}</h5>
          <div className="card-meta small text-muted mb-2">
            <span className="badge bg-neutral me-2 text-uppercase">
              {labelByType[type] || type}
            </span>
            <span>ID #{item.uid}</span>
          </div>

        {/* Descripción (resumen) */}
          {loadingDesc ? (
            <p className="text-muted small mb-0">Loading description…</p>
          ) : (
            <p className="text-muted small mb-0 clamp-3">
              {desc && desc.trim().length > 0 ? desc : "No description available."}
            </p>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <button
            className="btn btn-glass btn-pill"
            onClick={() => navigate(`/details/${type}/${item.uid}`)}
          >
            Learn more
          </button>
          <button
            className="btn btn-ghost btn-pill"
            onClick={() => actions.addFavorite({ ...item, type })}
            title="Add to favorites"
          >
            <i className="far fa-heart me-1"></i> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;







