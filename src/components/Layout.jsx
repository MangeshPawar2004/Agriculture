// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="mt-4 px-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
