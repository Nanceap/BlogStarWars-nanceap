import React, { useContext } from "react";
import { Context } from "../store.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { store, actions } = useContext(Context);

  return (
    <nav className="navbar navbar-dark bg-dark px-4 mb-3">
      <Link to="/" className="navbar-brand fw-bold">
        Star Wars
      </Link>

      <div className="d-flex align-items-center gap-2 ms-auto">
        {/* Botones de navegación */}
        <Link to="/" className="btn btn-glass btn-pill">
          Home
        </Link>
        <Link to="/details/people/1" className="btn btn-glass btn-pill">
          Characters
        </Link>
        <Link to="/details/planets/1" className="btn btn-glass btn-pill">
          Planets
        </Link>
        <Link to="/details/starships/9" className="btn btn-glass btn-pill">
          Starships
        </Link>

        {/* Dropdown favoritos */}
        <div className="dropdown">
          <button
            className="btn btn-ghost btn-pill dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Favorites ({store.favorites.length})
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {store.favorites.length === 0 && (
              <li className="dropdown-item text-muted">No favorites</li>
            )}
            {store.favorites.map((fav, i) => (
              <li
                key={i}
                className="dropdown-item d-flex justify-content-between align-items-center"
              >
                {fav.name}
                <button
                  className="btn btn-ghost btn-pill btn-sm text-danger"
                  onClick={() => actions.removeFavorite(fav.uid, fav.type)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



