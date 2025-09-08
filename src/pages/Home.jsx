import React, { useContext, useEffect } from "react";
import { Context } from "../store.jsx";
import Card from "../components/Card.jsx";

const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => { actions.loadInitialData(); }, []);

  return (
    <div className="container py-4">
      <h1 className="display-title mb-2">New and trending</h1>
      <p className="text-muted mb-4">Based on SWAPI resources</p>

      <h2 className="section-title mb-2">Characters</h2>
      <div className="row g-3 mb-4">
        {store.characters.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`people-${item.uid}`}>
            <Card item={item} type="people" />
          </div>
        ))}
      </div>

      <h2 className="section-title mb-2">Planets</h2>
      <div className="row g-3 mb-4">
        {store.planets.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`planet-${item.uid}`}>
            <Card item={item} type="planets" />
          </div>
        ))}
      </div>

      <h2 className="section-title mb-2">Starships</h2>
      <div className="row g-3 mb-4">
        {store.starships.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`starship-${item.uid}`}>
            <Card item={item} type="starships" />
          </div>
        ))}
      </div>

      <h2 className="section-title mb-2">Vehicles</h2>
      <div className="row g-3 mb-4">
        {store.vehicles.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`vehicle-${item.uid}`}>
            <Card item={item} type="vehicles" />
          </div>
        ))}
      </div>

      <h2 className="section-title mb-2">Species</h2>
      <div className="row g-3 mb-4">
        {store.species.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`species-${item.uid}`}>
            <Card item={item} type="species" />
          </div>
        ))}
      </div>

      <h2 className="section-title mb-2">Films</h2>
      <div className="row g-3 mb-2">
        {store.films.map((item) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`film-${item.uid}`}>
            <Card item={item} type="films" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;



