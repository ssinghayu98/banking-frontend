// ===============================
// 🌐 API CONFIG (PRODUCTION + LOCAL)
// ===============================

// 🔥 Change this if backend URL changes
const PROD_URL = "https://banking-app-production-54bc.up.railway.app";

// Optional: local dev support
const LOCAL_URL = "http://localhost:8080";

// ✅ Auto switch (development vs production)
const API_URL =
  window.location.hostname === "localhost"
    ? LOCAL_URL
    : PROD_URL;

export default API_URL;