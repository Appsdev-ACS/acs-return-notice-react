import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import ReturnForm from "./pages/form.jsx";

import "./assets/css/app.css";
import "./assets/css/main.css";

function ProtectedRoute({ children }) {
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/me", {
        withCredentials: true,
      })
      .then(() => {
        setStatus("authenticated");
      })
      .catch(() => {
        window.location.href = "https://acs-return-notice-1086168806252.europe-west1.run.app/login";
      });
  }, []);

  if (status === "loading") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // return (
  //   <>
  //     <Navbar />
  //     {children}
  //   </>
  // );
  return children
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

// import Home from "./pages/Home";
// import ReturnForm from "./pages/form.jsx";

// import "./assets/css/app.css";
// import "./assets/css/main.css";

// // 🔐 Protected Route
// function ProtectedRoute({ children }) {
//   const [status, setStatus] = React.useState("loading");

//   React.useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/me", {
//         withCredentials: true,
//       })
//       .then(() => {
//         setStatus("authenticated");
//       })
//       .catch(() => {
//         window.location.href = "http://localhost:5000/login";
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

// // 🚀 Main App
// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect root → form */}
//         <Route path="/" element={<Navigate to="/form" replace />} />

//         {/* Protected Form Page */}
//         <Route
//           path="/form"
//           element={
//             <ProtectedRoute>
//               <ReturnForm />
//             </ProtectedRoute>
//           }
//         />

//         {/* Optional fallback route */}
//         <Route path="*" element={<h2 style={{ padding: "20px" }}>Page Not Found</h2>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


