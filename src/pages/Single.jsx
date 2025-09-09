import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store.jsx";
import SmartImage from "../components/SmartImage.jsx";

const FIELD_MAP = {
  people: ["name","birth_year","gender","height","skin_color","eye_color","hair_color","mass"],
  planets: ["name","climate","terrain","population","gravity","diameter","rotation_period","orbital_period"],
  starships: ["name","model","manufacturer","starship_class","cost_in_credits","crew","passengers","hyperdrive_rating"],
  vehicles: ["name","model","manufacturer","vehicle_class","cost_in_credits","crew","passengers","max_atmosphering_speed"],
  species: ["name","classification","designation","language","average_height","skin_colors","hair_colors","eye_colors"],
  films: ["title","episode_id","director","producer","release_date"],
};

const TYPE_LABEL = {
  people: "Characters",
  planets: "Planets",
  starships: "Starships",
  vehicles: "Vehicles",
  species: "Species",
  films: "Films",
};

export default function Single() {
  const { store } = useContext(Context);
  const params = useParams();
  const [data, setData] = useState(null);
  const [swapiDesc, setSwapiDesc] = useState("");

  const fields = FIELD_MAP[params.type] || [];

  useEffect(() => {
    let alive = true;
    setData(null);
    setSwapiDesc("");
    (async () => {
      try {
        const resp = await fetch(`https://www.swapi.tech/api/${params.type}/${params.id}`);
        const json = await resp.json();
        if (!alive) return;
        setData(json.result);
        setSwapiDesc(json.result?.description || "");
      } catch (err) {
        console.error("Error fetching detail:", err);
      }
    })();
    return () => { alive = false; };
  }, [params.type, params.id]);

  const titleText = useMemo(() => {
    if (!data?.properties) return "";
    return data.properties.name || data.properties.title || "Details";
  }, [data]);

  const mediaMap = store.mediaMaps?.[params.type] || new Map();
  const media = titleText ? mediaMap.get(titleText.toLowerCase()) : null;
  const description = media?.description?.trim()
    ? media.description
    : (swapiDesc || "A long time ago in a galaxy far, far away...");

  return (
    <div className="container text-center text-md-start mt-5">
      {data ? (
        <>
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-6">
              <SmartImage
                type={params.type}
                uid={params.id}
                name={titleText}
                alt={titleText}
              />
            </div>

            <div className="col-12 col-lg-6 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-neutral text-uppercase">{TYPE_LABEL[params.type] || params.type}</span>
                <span className="text-muted small">ID #{params.id}</span>
              </div>
              <h1 className="mb-2">{titleText}</h1>

              <p className="text-light">{description}</p>

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
                  <p className="text-light mb-0">{value ?? "n/a"}</p>
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
}






