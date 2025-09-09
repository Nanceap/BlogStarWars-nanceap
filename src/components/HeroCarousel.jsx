import React, { useEffect, useState } from "react";
import { fetchMovieData } from "../services/omdb";

// Lista de películas + series
const STARWARS_TITLES = [
  // Películas
  "Star Wars: Episode IV - A New Hope",
  "Star Wars: Episode V - The Empire Strikes Back",
  "Star Wars: Episode VI - Return of the Jedi",
  "Star Wars: Episode I - The Phantom Menace",
  "Star Wars: Episode II - Attack of the Clones",
  "Star Wars: Episode III - Revenge of the Sith",
  "Star Wars: Episode VII - The Force Awakens",
  "Star Wars: Episode VIII - The Last Jedi",
  "Star Wars: Episode IX - The Rise of Skywalker",

  // Spin-offs
  "Rogue One: A Star Wars Story",
  "Solo: A Star Wars Story",

  // Series live-action
  "The Mandalorian",
  "The Book of Boba Fett",
  "Obi-Wan Kenobi",
  "Andor",
  "Ahsoka",
  "The Acolyte",

  // Series animadas
  "Star Wars: The Clone Wars",
  "Star Wars Rebels",
  "Star Wars: The Bad Batch",
  "Tales of the Jedi",
  "Star Wars: Visions",
];

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        STARWARS_TITLES.map(async (title) => {
          const data = await fetchMovieData(title);
          return data && data.poster ? data : null;
        })
      );
      setSlides(results.filter(Boolean));
    };
    load();
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade mb-5"
      data-bs-ride="carousel"
      data-bs-interval="5000"
    >
      <div className="carousel-inner rounded-4 shadow-lg">
        {slides.map((s, idx) => (
          <div key={s.title} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
            <img
              src={s.poster}
              className="d-block w-100"
              alt={s.title}
              style={{ objectFit: "cover", height: "70vh" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-pill px-3">
              <h5 className="mb-1">{s.title} ({s.year})</h5>
              {s.plot && <p className="small mb-0">{s.plot}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>

      {/* Indicadores */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

