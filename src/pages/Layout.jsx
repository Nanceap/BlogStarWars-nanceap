import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

const Layout = () => (
  <>
    <Navbar />
    <div className="nav-spacer" />
    <ScrollToTop />
    <Outlet />
  </>
);

export default Layout;

