import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 🔥 Get root element
const rootElement = document.getElementById("root");

// ❌ Safety check (prevents blank screen confusion)
if (!rootElement) {
  throw new Error("Root element not found. Check public/index.html");
}

// ✅ Create root
const root = ReactDOM.createRoot(rootElement);

// ✅ Render App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: performance logging
reportWebVitals();