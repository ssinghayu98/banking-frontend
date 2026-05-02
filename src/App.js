import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";

/* 🔒 USER PROTECTION (SIMPLE + RELIABLE) */
const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("username");

  return username ? children : <Navigate to="/" replace />;
};

/* 👑 ADMIN PROTECTION */
const AdminRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;