import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store.jsx";

const labelByType = {
  people: "Characters",
  planets: "Planets",
  starships: "Starships",
  vehicles: "Vehicles",
  species: "Species",
  films: "Films",
};

const Card = ({ item, type }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const mediaMap = store.mediaMaps?.[type] || new Map();
  const key = (item.name || "").toLowerCase();
  const media = mediaMap.get(key);

  const imageUrl = media?.image || "/placeholder.jpg";
  const description = media?.description || "No description available.";

  return (
    <div className="card card--dark h-100">
      <div className="card__thumb ratio-16x9">
        <img
          src={imageUrl}
          alt={item.name}
          className="img-cover"
          style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{item.name}</h5>
        <div className="card-meta small mb-2">
          <span className="badge bg-neutral me-2 text-uppercase">
            {labelByType[type] || type}
          </span>
          <span>ID #{item.uid}</span>
        </div>
        <p className="text-light small clamp-3">{description}</p>
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
          >
            <i className="far fa-heart me-1"></i> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;









