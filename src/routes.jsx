import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Single from "./pages/Single.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="details/:type/:id" element={<Single />} />
    </Route>
  </Routes>
);

export default App;

