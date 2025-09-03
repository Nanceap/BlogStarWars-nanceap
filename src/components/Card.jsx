import React, { useContext, useState } from "react";
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

const Card = ({ item, type, compact = false }) => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const imgDir = typeToImageDir[type] || type;
  const imageUrl = `https://starwars-visualguide.com/assets/img/${imgDir}/${item.uid}.jpg`;

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
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="mb-2">
          <h5 className="card-title mb-2">{item.name}</h5>
          <div className="card-meta small text-muted">
            <span className="badge bg-secondary me-2 text-uppercase">{type}</span>
            <span>ID #{item.uid}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/details/${type}/${item.uid}`)}
          >
            Learn more
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => actions.addFavorite({ ...item, type })}
            title="Add to favorites"
          >
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;




