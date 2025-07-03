import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Single = () => {
  const params = useParams();
  const [data, setData] = useState(null);

  const imageUrl = `https://starwars-visualguide.com/assets/img/${params.type}/${params.id}.jpg`;

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
    getData();
  }, [params.type, params.id]);

  return (
    <div className="container text-center text-md-start mt-5">
      {data ? (
        <>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div
                className="bg-secondary"
                style={{ width: "100%", height: "400px", overflow: "hidden" }}
              >
                <img
                  src={imageUrl}
                  alt={data.properties.name}
                  className="img-fluid"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            </div>

            <div className="col-md-6">
              <h1>{data.properties.name}</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                commodi dolorum, eius amet porro fugiat? Provident autem
                expedita blanditiis saepe tempore quos voluptas tenetur earum
                corrupti quasi.
              </p>
            </div>
          </div>

          <hr className="text-danger" />

          <div className="row text-center text-danger fw-bold">
            <div className="col">
              <p>Name</p>
              <p className="text-dark">{data.properties.name}</p>
            </div>
            <div className="col">
              <p>Birth Year</p>
              <p className="text-dark">{data.properties.birth_year || "n/a"}</p>
            </div>
            <div className="col">
              <p>Gender</p>
              <p className="text-dark">{data.properties.gender || "n/a"}</p>
            </div>
            <div className="col">
              <p>Height</p>
              <p className="text-dark">{data.properties.height || "n/a"}</p>
            </div>
            <div className="col">
              <p>Skin Color</p>
              <p className="text-dark">{data.properties.skin_color || "n/a"}</p>
            </div>
            <div className="col">
              <p>Eye Color</p>
              <p className="text-dark">{data.properties.eye_color || "n/a"}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-muted">Loading...</p>
      )}
    </div>
  );
};

export default Single;



