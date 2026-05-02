import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            style={input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={button}>Signup</button>
        </form>

        <p onClick={() => navigate("/")} style={link}>
          Already have an account? Login
        </p>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "300px",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
};

const button = {
  width: "100%",
  padding: "10px",
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
};

const link = {
  marginTop: "10px",
  color: "#667eea",
  cursor: "pointer",
};

export default Signup;