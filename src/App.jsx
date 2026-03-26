import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import ReturnForm from "./pages/form.jsx";
import LocationForm from "./pages/locationForm";

import "./assets/css/app.css";
import "./assets/css/main.css";

function ProtectedRoute({ children }) {
  const [status, setStatus] = React.useState("loading");
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/me", {
        withCredentials: true,
      })
      .then(() => {
        const pendingRoute = localStorage.getItem("postLoginRedirect");

        if (
          pendingRoute &&
          pendingRoute !== location.pathname &&
          (location.pathname === "/form" || location.pathname === "/")
        ) {
          localStorage.removeItem("postLoginRedirect");
          navigate(pendingRoute, { replace: true });
          return;
        }

        localStorage.removeItem("postLoginRedirect");
        setStatus("authenticated");
      })
      .catch(() => {
        localStorage.setItem("postLoginRedirect", location.pathname);
        window.location.href = "https://acs-return-notice-1086168806252.europe-west1.run.app/login";
      });
  }, [location.pathname, navigate]);

  if (status === "loading") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/form" replace />} />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <ReturnForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/location-form"
          element={
            <ProtectedRoute>
              <LocationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<h2 style={{ padding: "20px" }}>Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;



// import React from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import axios from "axios";

// import Navbar from "./components/Navbar";
// import ReturnForm from "./pages/form.jsx";
// import LocationForm from "./pages/locationForm";

// import "./assets/css/app.css";
// import "./assets/css/main.css";

// function ProtectedRoute({ children }) {
//   const [status, setStatus] = React.useState("loading");

//   React.useEffect(() => {
//     axios
//       .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/me", {
//         withCredentials: true,
//       })
//       .then(() => {
//         setStatus("authenticated");
//       })
//       // .catch(() => {
//       //   window.location.href = "https://acs-return-notice-1086168806252.europe-west1.run.app/login";
//       // });
//       .catch(() => {
//         const currentPath = window.location.hash || "#/form";
//         const encodedPath = encodeURIComponent(currentPath);
//         window.location.href = `https://acs-return-notice-1086168806252.europe-west1.run.app/login?next=${encodedPath}`;
//       });
//   }, []);

//   if (status === "loading") {
//     return (
//       <div style={{ padding: "20px", textAlign: "center" }}>
//         Loading...
//       </div>
//     );
//   }

//   return children;
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/form" replace />} />

//         <Route
//           path="/form"
//           element={
//             <ProtectedRoute>
//               <ReturnForm />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/location-form"
//           element={
//             <ProtectedRoute>
//               <LocationForm />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="*"
//           element={<h2 style={{ padding: "20px" }}>Page Not Found</h2>}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;