import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

const FIELD_MAP = {
  people: ["name", "birth_year", "gender", "height", "skin_color", "eye_color", "hair_color", "mass"],
  planets: ["name", "climate", "terrain", "population", "gravity", "diameter", "rotation_period", "orbital_period"],
  starships: ["name", "model", "manufacturer", "starship_class", "cost_in_credits", "crew", "passengers", "hyperdrive_rating"],
  vehicles: ["name", "model", "manufacturer", "vehicle_class", "cost_in_credits", "crew", "passengers", "max_atmosphering_speed"],
  species: ["name", "classification", "designation", "language", "average_height", "skin_colors", "hair_colors", "eye_colors"],
  films: ["title", "episode_id", "director", "producer", "release_date"],
};

const typeToImageDir = {
  people: "characters",
  planets: "planets",
  starships: "starships",
  vehicles: "vehicles",
  species: "species",
  films: "films",
};

const TYPE_LABEL = {
  people: "Characters",
  planets: "Planets",
  starships: "Starships",
  vehicles: "Vehicles",
  species: "Species",
  films: "Films",
};

const Single = () => {
  const params = useParams();
  const [data, setData] = useState(null);

  const imgDir = typeToImageDir[params.type] || params.type;
  const imageUrl = `https://starwars-visualguide.com/assets/img/${imgDir}/${params.id}.jpg`;

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await fetch(`https://www.swapi.tech/api/${params.type}/${params.id}`);
        const result = await resp.json();
        setData(result.result);
      } catch (err) {
        console.error("Error fetching detail:", err);
      }
    };
    setData(null);
    getData();
  }, [params.type, params.id]);

  const fields = FIELD_MAP[params.type] || [];

  const titleText = useMemo(() => {
    if (!data?.properties) return "";
    return data.properties.name || data.properties.title || "Details";
  }, [data]);

  return (
    <div className="container text-center text-md-start mt-5">
      {data ? (
        <>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="bg-secondary" style={{ width: "100%", height: "400px", overflow: "hidden" }}>
                <img
                  src={imageUrl}
                  alt={titleText}
                  className="img-fluid"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-neutral text-uppercase">{TYPE_LABEL[params.type] || params.type}</span>
                <span className="text-muted small">ID #{params.id}</span>
              </div>
              <h1 className="mb-2">{titleText}</h1>

              <p className="text-muted">
                {data.description || "A long time ago in a galaxy far, far away..."}
              </p>

              <button className="btn btn-ghost btn-pill mt-2" onClick={() => history.back()}>
                ← Back
              </button>
            </div>
          </div>

          <hr className="text-danger" />

          <div className="row text-center text-danger fw-bold">
            {fields.map((key) => {
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              const value = data.properties[key];
              return (
                <div className="col-6 col-md-4 col-lg-2 mb-3" key={key}>
                  <p className="mb-1">{label}</p>
                  <p className="text-dark mb-0">{value ?? "n/a"}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-center text-muted">Loading...</p>
      )}
    </div>
  );
};

export default Single;




