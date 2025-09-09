import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../store.jsx";
import Card from "../components/Card.jsx";
import HeroAccordion from "../components/HeroAccordion.jsx";

const RESOURCE_OPTIONS = [
  { value: "people", label: "Characters" },
  { value: "planets", label: "Planets" },
  { value: "starships", label: "Starships" },
  { value: "vehicles", label: "Vehicles" },
  { value: "species", label: "Species" },
  { value: "films", label: "Films" },
];

const ORDER_OPTIONS = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "id-asc", label: "ID ↑" },
  { value: "id-desc", label: "ID ↓" },
];

const PAGE_SIZE_OPTIONS = [8, 12, 16, 24];

const vgDirMap = {
  people: "characters",
  planets: "planets",
  starships: "starships",
  vehicles: "vehicles",
  species: "species",
  films: "films",
};

const Home = () => {
  const { store, actions } = useContext(Context);

  const [resource, setResource] = useState("people");
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("name-asc");
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [onlyWithDesc, setOnlyWithDesc] = useState(false);
  const [display, setDisplay] = useState("grid");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  useEffect(() => { actions.loadInitialData(); }, []);
  useEffect(() => { setPage(1); }, [resource, query, order, onlyWithImage, onlyWithDesc, pageSize]);

  // Prewarm
  useEffect(() => {
    const prewarm = (arr, type) => {
      const mediaMap = store.mediaMaps?.[type] || new Map();
      const dir = vgDirMap[type] || type;
      arr.slice(0, 8).forEach((item) => {
        const name = (item.name || "").toLowerCase();
        const db = mediaMap.get(name);
        const vgUrl = `https://starwars-visualguide.com/assets/img/${dir}/${item.uid}.jpg`;
        const url = db?.image || vgUrl;
        if (url) { const img = new Image(); img.src = url; }
      });
    };
    prewarm(store.characters, "people");
    prewarm(store.planets, "planets");
    prewarm(store.starships, "starships");
    prewarm(store.vehicles, "vehicles");
    prewarm(store.species, "species");
    prewarm(store.films, "films");
  }, [store]);

  const rawItems = useMemo(() => {
    const key = resource === "people" ? "characters" : resource;
    return store[key] || [];
  }, [store, resource]);

  const mediaMap = store.mediaMaps?.[resource] || new Map();

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = rawItems.map(it => ({
      ...it,
      uidNum: Number(it.uid) || 0,
      hasImage: Boolean(mediaMap.get((it.name || "").toLowerCase())?.image),
      hasDesc: Boolean(mediaMap.get((it.name || "").toLowerCase())?.description?.trim?.())
    }));
    if (q) arr = arr.filter(it => (it.name || "").toLowerCase().includes(q));
    if (onlyWithImage) arr = arr.filter(it => it.hasImage);
    if (onlyWithDesc) arr = arr.filter(it => it.hasDesc);

    switch (order) {
      case "name-asc": arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": arr.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "id-asc": arr.sort((a, b) => a.uidNum - b.uidNum); break;
      case "id-desc": arr.sort((a, b) => b.uidNum - a.uidNum); break;
      default: break;
    }
    return arr;
  }, [rawItems, mediaMap, query, onlyWithImage, onlyWithDesc, order]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filteredSorted.slice(start, start + pageSize);

  return (
    <div className="container-fluid px-0">
      <HeroAccordion />

      <div className="container py-4">
        {/* Toolbar */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          {/* Resource */}
          <div className="dropdown">
            <button className="btn btn-glass btn-pill dropdown-toggle" data-bs-toggle="dropdown">
              {RESOURCE_OPTIONS.find(o => o.value === resource)?.label || "Resource"}
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

          {/* Order */}
          <div className="dropdown">
            <button className="btn btn-ghost btn-pill dropdown-toggle" data-bs-toggle="dropdown">
              Order: {ORDER_OPTIONS.find(o => o.value === order)?.label}
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

          {/* Page size */}
          <div className="dropdown">
            <button className="btn btn-ghost btn-pill dropdown-toggle" data-bs-toggle="dropdown">
              Page size: {pageSize}
            </button>
            <ul className="dropdown-menu">
              {PAGE_SIZE_OPTIONS.map(ps => (
                <li key={ps}>
                  <button className="dropdown-item" onClick={() => setPageSize(ps)}>
                    {ps}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search */}
          <div className="ms-md-2 flex-grow-1" style={{ minWidth: 200, maxWidth: 480 }}>
            <input
              className="form-control form-control-dark"
              placeholder="Search by name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Toggles */}
          <button
            className={`btn btn-pill ${onlyWithImage ? "btn-glass" : "btn-ghost"}`}
            onClick={() => setOnlyWithImage(v => !v)}
            title="Show only items that have image"
          >
            <i className="far fa-image me-1"></i> With image
          </button>
          <button
            className={`btn btn-pill ${onlyWithDesc ? "btn-glass" : "btn-ghost"}`}
            onClick={() => setOnlyWithDesc(v => !v)}
            title="Show only items that have description"
          >
            <i className="far fa-file-alt me-1"></i> With description
          </button>

          {/* Display */}
          <div className="ms-auto d-flex align-items-center gap-2">
            <button
              className={`btn btn-pill ${display === "grid" ? "btn-glass" : "btn-ghost"}`}
              onClick={() => setDisplay("grid")}
              title="Grid"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              className={`btn btn-pill ${display === "list" ? "btn-glass" : "btn-ghost"}`}
              onClick={() => setDisplay("list")}
              title="List"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>

        {/* Results */}
        {display === "grid" ? (
          <div className="row g-3">
            {pageItems.map(item => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`${resource}-${item.uid}`}>
                <Card item={item} type={resource} />
              </div>
            ))}
          </div>
        ) : (
          <div className="vstack gap-3">
            {pageItems.map(item => (
              <div key={`${resource}-row-${item.uid}`} className="card card--dark p-2 d-flex flex-row align-items-stretch">
                <div className="flex-grow-1">
                  <Card item={item} type={resource} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {total === 0 && (
          <div className="text-center text-muted py-5">No results</div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-ghost btn-pill"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              ← Prev
            </button>
            <span className="text-muted">
              Page {currentPage} / {totalPages} · {total} results
            </span>
            <button
              className="btn btn-ghost btn-pill"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;







