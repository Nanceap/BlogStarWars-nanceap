import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import injectContext from "./store.jsx";
import routes from "./routes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

const App = injectContext(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
);


