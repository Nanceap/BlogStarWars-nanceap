import React, { useState, useEffect, useRef } from "react";
import { fetchMovieData } from "../services/omdb";

const STARWARS_TITLES = [
  "Star Wars: Episode IV - A New Hope",
  "Star Wars: Episode V - The Empire Strikes Back",
  "Star Wars: Episode VI - Return of the Jedi",
  "Star Wars: Episode I - The Phantom Menace",
  "Star Wars: Episode II - Attack of the Clones",
  "Star Wars: Episode III - Revenge of the Sith",
  "Star Wars: Episode VII - The Force Awakens",
  "Star Wars: Episode VIII - The Last Jedi",
  "Star Wars: Episode IX - The Rise of Skywalker",
  "Rogue One: A Star Wars Story",
  "Solo: A Star Wars Story",
  "The Mandalorian",
  "The Book of Boba Fett",
  "Obi-Wan Kenobi",
  "Andor",
  "Ahsoka",
  "The Acolyte",
  "Star Wars: The Clone Wars",
  "Star Wars Rebels",
  "Star Wars: The Bad Batch",
  "Tales of the Jedi",
  "Star Wars: Visions",
];

const INTERVAL_MS = 5000;

const HeroAccordion = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const timerRef = useRef(null);

  // cargar info desde OMDb
  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        STARWARS_TITLES.map(async (title) => {
          const data = await fetchMovieData(title);
          return data && data.poster ? data : null;
        })
      );
      const filtered = results.filter(Boolean);
      setSlides(filtered);

      // preload de imágenes
      filtered.forEach((s) => {
        const img = new Image();
        img.src = s.poster;
      });
    };
    load();
  }, []);

  // autoplay
  useEffect(() => {
    if (!slides.length) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setShowText(false); // ocultar texto al pasar al siguiente
    }, INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const handleHover = (idx) => {
    setActiveIndex(idx);
    setShowText(false); // reset texto
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setShowText(false);
    }, INTERVAL_MS);
  };

  const handleClick = (idx) => {
    if (idx === activeIndex) {
      setShowText((prev) => !prev); // toggle texto solo en activo
    } else {
      setActiveIndex(idx);
      setShowText(true);
    }
  };

  return (
    <div className="hero-accordion mb-5">
      {slides.map((s, idx) => (
        <div
          key={s.title}
          className={`hero-slide ${idx === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.poster})` }}
          onMouseEnter={() => handleHover(idx)}
          onClick={() => handleClick(idx)}
          role="button"
          aria-label={`${s.title} (${s.year})`}
        >
          {/* Overlay: solo visible si está activa y showText es true */}
          {idx === activeIndex && showText && (
            <div className="hero-overlay">
              <h3 className="hero-title">
                {s.title} <span className="hero-year">({s.year})</span>
              </h3>
              {s.plot && <p className="hero-plot">{s.plot}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeroAccordion;


