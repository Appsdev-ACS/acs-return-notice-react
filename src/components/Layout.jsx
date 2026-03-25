import React from "react";
import Navbar from "./Navbar";

function getUrl(type) {
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "/";

  const routes = {
    search_by_bus: `${baseUrl}#/search-by-bus`,
    search_by_student: `${baseUrl}#/search-by-student`
  };

  return routes[type] || baseUrl; // fallback if not found
}

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
