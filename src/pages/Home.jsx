import React, { useContext, useEffect } from "react";
import { Context } from "../store.jsx";
import Card from "../components/Card.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";

const Home = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => { actions.loadInitialData(); }, []);

  return (
    <div className="container-fluid px-0">
      <HeroCarousel />

      <div className="container py-4">
        <h2 className="section-title mb-2">Characters</h2>
        <div className="row g-3 mb-4">
          {store.characters.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`people-${item.uid}`}>
              <Card item={item} type="people" />
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
};

export default Home;




