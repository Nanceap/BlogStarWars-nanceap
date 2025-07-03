import React, { useContext, useEffect } from "react";
import { Context } from "../store.jsx";
import Card from "../components/Card.jsx";

const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => { actions.loadInitialData(); }, []);

  return (
    <div className="container">
      <h2 className="text-danger mb-2">Characters</h2>
      <div className="d-flex overflow-auto mb-4">
        {store.characters.map(item => <Card key={item.uid} item={item} type="people" />)}
      </div>
      <h2 className="text-danger mb-2">Planets</h2>
      <div className="d-flex overflow-auto">
        {store.planets.map(item => <Card key={item.uid} item={item} type="planets" />)}
      </div>
    </div>
  );
};

export default Home;

