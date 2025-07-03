import React, { useState, createContext } from "react";
export const Context = createContext(null);

const injectContext = (PassedComponent) => {
  return function StoreWrapper(props) {
    const [store, setStore] = useState({
      characters: [],
      planets: [],
      favorites: []
    });

    const actions = {
      loadInitialData: async () => {
        try {
          const [resC, resP] = await Promise.all([
            fetch("https://www.swapi.tech/api/people"),
            fetch("https://www.swapi.tech/api/planets")
          ]);
          const [jsonC, jsonP] = await Promise.all([resC.json(), resP.json()]);
          setStore(prev => ({ ...prev, characters: jsonC.results, planets: jsonP.results }));
        } catch (err) { console.error(err); }
      },

      addFavorite: (item) => {
        setStore(prev => {
          const exists = prev.favorites.find(
            fav => fav.uid === item.uid && fav.type === item.type
          );
          if (!exists) return { ...prev, favorites: [...prev.favorites, item] };
          return prev;
        });
      },

      removeFavorite: (uid, type) => {
        setStore(prev => ({
          ...prev,
          favorites: prev.favorites.filter(
            fav => fav.uid !== uid || fav.type !== type
          )
        }));
      }
    };

    return (
      <Context.Provider value={{ store, actions }}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
};

export default injectContext;




