import React, { useState, createContext } from "react";
import { buildDbMediaMap } from "./services/databank"; 

export const Context = createContext(null);

const injectContext = (PassedComponent) => {
  return function StoreWrapper(props) {
    const [store, setStore] = useState({
      characters: [],
      planets: [],
      starships: [],
      vehicles: [],
      species: [],
      films: [],
      favorites: [],
      mediaMaps: {
        people: new Map(),
        planets: new Map(),
        starships: new Map(),
        vehicles: new Map(),
        species: new Map(),
        films: new Map(),
      },
    });

    const actions = {
      loadInitialData: async () => {
        try {
          // Datos base de SWAPI (listado con uid)
          const endpoints = ["people","planets","starships","vehicles","species","films"];
          const responses = await Promise.all(
            endpoints.map((e) => fetch(`https://www.swapi.tech/api/${e}?page=1&limit=50`))
          );
          const payloads = await Promise.all(responses.map((r) => r.json()));

          const data = {};
          endpoints.forEach((key, idx) => {
            const results = payloads[idx]?.results || [];
            data[key] = results.map((it) => ({
              ...it,
              name: it.name || it.title || "Unknown"
            }));
          });

          setStore((prev) => ({
            ...prev,
            characters: data.people || [],
            planets: data.planets || [],
            starships: data.starships || [],
            vehicles: data.vehicles || [],
            species: data.species || [],
            films: data.films || [],
          }));

          // Media maps desde Databank API
          const [mmPeople, mmPlanets, mmVehicles, mmSpecies] = await Promise.all([
            buildDbMediaMap("people",   10, 20), 
            buildDbMediaMap("planets",  10, 20),
            buildDbMediaMap("vehicles", 10, 20),
            buildDbMediaMap("species",  10, 20),
          ]);

          setStore((prev) => ({
            ...prev,
            mediaMaps: {
              ...prev.mediaMaps,
              people: mmPeople,
              planets: mmPlanets,
              starships: mmVehicles, 
              vehicles: mmVehicles,
              species: mmSpecies,
            },
          }));

        } catch (err) {
          console.error("Error loading data:", err);
        }
      },

      addFavorite: (item) => {
        setStore((prev) => {
          const exists = prev.favorites.find(
            (fav) => fav.uid === item.uid && fav.type === item.type
          );
          if (!exists) return { ...prev, favorites: [...prev.favorites, item] };
          return prev;
        });
      },

      removeFavorite: (uid, type) => {
        setStore((prev) => ({
          ...prev,
          favorites: prev.favorites.filter(
            (fav) => fav.uid !== uid || fav.type !== type
          ),
        }));
      },
    };

    return (
      <Context.Provider value={{ store, actions }}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
};

export default injectContext;






