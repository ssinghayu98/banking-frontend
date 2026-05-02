import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      return setError("Please enter username and password");
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 FIXED BACKEND URL
      const res = await fetch(
        "https://banking-app-production-54bc.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok || !data || !data.data) {
        throw new Error(data?.message || "Invalid username or password");
      }

      // 🔥 CLEAR OLD SESSION
      localStorage.clear();

      const user = data.data;

      localStorage.setItem("username", user.username);

      const role = user.username === "admin" ? "admin" : "user";
      localStorage.setItem("role", role);

      console.log("Stored:", {
        username: localStorage.getItem("username"),
        role: localStorage.getItem("role"),
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 100);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[350px] border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🏦 Bankify
        </h1>
        <p className="text-center text-gray-200 mb-6 text-sm">
          Secure Digital Banking
        </p>

        {error && (
          <p className="bg-red-500/20 text-red-200 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30 focus:ring-2 focus:ring-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30 focus:ring-2 focus:ring-white"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-200 mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline hover:text-white">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;