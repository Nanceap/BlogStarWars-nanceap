import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store.jsx";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <nav className={`navbar navbar--glass ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container d-flex align-items-center">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold">Star Wars</Link>

        {/* Navegación primaria */}
        <div className="d-none d-md-flex align-items-center gap-2 ms-3">
          <Link to="/" className="btn btn-ghost btn-pill">Home</Link>
          <Link to="/details/people/1" className="btn btn-ghost btn-pill">Characters</Link>
          <Link to="/details/planets/1" className="btn btn-ghost btn-pill">Planets</Link>
          <Link to="/details/starships/9" className="btn btn-ghost btn-pill">Starships</Link>
        </div>

        {/* Fav dropdown */}
        <div className="ms-auto dropdown">
          <button
            className="btn btn-glass btn-pill dropdown-toggle"
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




