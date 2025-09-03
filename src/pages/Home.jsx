import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../store.jsx";
import Card from "../components/Card.jsx";

const RESOURCE_OPTIONS = [
  { value: "people", label: "Characters" },
  { value: "planets", label: "Planets" },
  { value: "starships", label: "Starships" },
  { value: "vehicles", label: "Vehicles" },
  { value: "species", label: "Species" },
  { value: "films", label: "Films" },
];

const ORDER_OPTIONS = [
  { value: "name-asc", label: "A → Z" },
  { value: "name-desc", label: "Z → A" },
  { value: "id-asc", label: "ID ↑" },
  { value: "id-desc", label: "ID ↓" },
];

const Home = () => {
  const { store, actions } = useContext(Context);

  const [resource, setResource] = useState("people");
  const [order, setOrder] = useState("name-asc");
  const [display, setDisplay] = useState("grid"); // grid | list
  const [query, setQuery] = useState("");

  useEffect(() => { actions.loadInitialData(); }, []);

  const items = useMemo(() => {
    const arr = (store[resource === "people" ? "characters" : resource] || [])
      .map(it => ({ ...it, uidNum: Number(it.uid) || 0 }));
    let filtered = arr;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(it => it.name.toLowerCase().includes(q));
    }
    switch (order) {
      case "name-asc": filtered.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case "name-desc": filtered.sort((a,b)=>b.name.localeCompare(a.name)); break;
      case "id-asc": filtered.sort((a,b)=>a.uidNum-b.uidNum); break;
      case "id-desc": filtered.sort((a,b)=>b.uidNum-a.uidNum); break;
      default: break;
    }
    return filtered;
  }, [store, resource, order, query]);

  return (
    <div className="container py-4">
      <h1 className="display-title mb-2">New and trending</h1>
      <p className="text-muted mb-4">Based on SWAPI resources and release order</p>

      {/* Controls */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        <div className="dropdown">
          <button className="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
            Order by: <strong>{ORDER_OPTIONS.find(o=>o.value===order)?.label}</strong>
          </button>
          <ul className="dropdown-menu">
            {ORDER_OPTIONS.map(opt => (
              <li key={opt.value}>
                <button className="dropdown-item" onClick={() => setOrder(opt.value)}>
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="dropdown">
          <button className="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
            {RESOURCE_OPTIONS.find(o=>o.value===resource)?.label}
          </button>
          <ul className="dropdown-menu">
            {RESOURCE_OPTIONS.map(opt => (
              <li key={opt.value}>
                <button className="dropdown-item" onClick={() => setResource(opt.value)}>
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ms-auto d-flex align-items-center gap-2">
          <input
            className="form-control form-control-dark"
            placeholder="Search…"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <span className="text-muted me-2">Display options:</span>
          <button
            className={`btn ${display==="grid"?"btn-light":"btn-outline-light"}`}
            onClick={()=>setDisplay("grid")}
            title="Grid"
          >
            <i className="fas fa-th-large"></i>
          </button>
          <button
            className={`btn ${display==="list"?"btn-light":"btn-outline-light"}`}
            onClick={()=>setDisplay("list")}
            title="List"
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Grid/List */}
      {display === "grid" ? (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`${resource}-${item.uid}`}>
              <Card item={item} type={resource} />
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-muted py-5">No results</div>
          )}
        </div>
      ) : (
        <div className="vstack gap-3">
          {items.map((item) => (
            <div key={`${resource}-row-${item.uid}`} className="card card--dark p-2 d-flex flex-row align-items-stretch">
              <div className="card__thumb card__thumb--list bg-secondary me-3">
                {/* Imagen y fallback ya gestionados dentro de Card; acá simplificado */}
                <Card item={item} type={resource} compact />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-muted py-5">No results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;


