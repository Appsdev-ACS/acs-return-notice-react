import React, { useState, useEffect } from "react";
import axios from "axios";

function getUrl(type) {
  const baseUrl = "/";

  const routes = {
    // search_by_bus: `${baseUrl}#/search-by-bus`,
    // search_by_student: `${baseUrl}#/search-by-student`,
    // search_by_grade: `${baseUrl}#/search-by-grade`,
    // search_by_homeroom: `${baseUrl}#/search-by-homeroom`,
  };

  return routes[type] || baseUrl;
}

export default function Navbar() {
  const [user, setUser] = useState(null);

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please sign in to continue");
    }
  };

  useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = "https://acs-return-notice-1086168806252.europe-west1.run.app/login";
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://acs-return-notice-1086168806252.europe-west1.run.app/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      window.location.href = "https://acs-return-notice-1086168806252.europe-west1.run.app/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Header / Logo */}
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center position-relative">
            <img src="images/logo.jpg" className="acs-logo" alt="Logo" />

            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {user ? (
                <>
                  <span style={{ fontWeight: "bold" }}>
                    Welcome, {user.email}
                  </span>
                  {/* <button
                    className="btn bi bi-box-arrow-right"
                    onClick={handleLogout}
                    style={{ fontWeight: "bold" }}
                  >
                    {" "}Sign out
                  </button> */}
                </>
              ) : (
                <></>
                // <button
                //   className="btn bi bi-box-arrow-in-right"
                //   onClick={handleLogin}
                //   style={{ fontWeight: "bold" }}
                // >
                //   {" "}Sign In
                // </button>
                
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="card-body bg-acs">
        <div className="row justify-content-center">
          <div className="col-md-3 col-12 mt-4 d-flex justify-content-start">
            <p
              className="bi bi-person-fill mb-0"
              style={{ color: "#ffff", fontSize: "1rem" }}
            >
              {" "}Return Notice Form
            </p>
          </div>

          {/* Example future links */}
          {/* 
          <div className="col-md-2 col-3 mt-4 text-center">
            <a href={getUrl("search_by_bus")} className="search-by-bus" onClick={handleClick}>
              <p className="bi bi-bus-front-fill" style={{ color: "#ffff", fontSize: "1rem" }}>
                {" "}Search by Bus
              </p>
            </a>
          </div>

          <div className="col-md-2 col-3 mt-4 text-center">
            <a href={getUrl("search_by_grade")} className="search-by-grade" onClick={handleClick}>
              <p className="bi bi-mortarboard-fill" style={{ color: "#ffff", fontSize: "1rem" }}>
                {" "}Search by Grade Level
              </p>
            </a>
          </div>

          <div className="col-md-2 col-3 mt-4 text-center">
            <a href={getUrl("search_by_homeroom")} className="search-by-homeroom" onClick={handleClick}>
              <p className="bi bi-buildings-fill" style={{ color: "#ffff", fontSize: "1rem" }}>
                {" "}Search by Homeroom
              </p>
            </a>
          </div>
          */}
        </div>
      </div>
    </>
  );
}

