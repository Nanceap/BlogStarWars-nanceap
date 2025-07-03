import React, { useContext } from "react";
import { Context } from "../store.jsx";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  return (
    <nav className="navbar navbar-light bg-light px-4 mb-3">
      <a className="navbar-brand">Star Wars</a>
      <div className="dropdown ms-auto">
        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          Favorites ({store.favorites.length})
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          {store.favorites.length === 0 && <li className="dropdown-item">No favorites</li>}
          {store.favorites.map((fav, i) => (
            <li key={i} className="dropdown-item d-flex justify-content-between align-items-center">
              {fav.name}
              <button
                className="btn btn-sm text-danger"
                onClick={() => actions.removeFavorite(fav.uid, fav.type)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

