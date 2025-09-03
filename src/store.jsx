import React, { useState, createContext } from "react";
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
      favorites: []
    });

    const actions = {
      loadInitialData: async () => {
        try {
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
        } catch (err) {
          console.error(err);
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





