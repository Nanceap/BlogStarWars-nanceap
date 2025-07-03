import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store.jsx";

const Card = ({ item, type }) => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const imageUrl = `https://starwars-visualguide.com/assets/img/${type}/${item.uid}.jpg`;

  return (
    <div className="card mx-2" style={{ width: "18rem", minWidth: "18rem" }}>
      <div className="card-img-top bg-secondary" style={{ height: "200px", overflow: "hidden" }}>
        <img
          src={imageUrl}
          alt={item.name}
          style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">ID: {item.uid}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/details/${type}/${item.uid}`)}
          >
            Learn more
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => actions.addFavorite({ ...item, type })}
          >
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;


