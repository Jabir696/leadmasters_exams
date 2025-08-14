import { useState } from "react";

export default function Login({ setToken, setView }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setView("exam");
    } else {
      alert(data.detail || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <h2>Login</h2>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => setView("register")}>Don't have an account? Register</p>
      </div>

      <style>
        {`
          .login-container {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background-color: #f4f6f8;
          }
          .form-card {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 300px;
            text-align: center;
          }
          .form-card h2 {
            margin-bottom: 1rem; font-size: 1.5rem; color: #333;
          }
          .form-card input {
            width: 100%; padding: 0.6rem; margin: 0.5rem 0;
            border: 1px solid #ccc; border-radius: 5px; outline: none;
          }
          .form-card button {
            width: 100%; padding: 0.6rem; background-color: #2563eb;
            color: white; border: none; border-radius: 5px;
            cursor: pointer; font-size: 1rem; margin-top: 0.5rem;
          }
          .form-card button:hover {
            background-color: #1e4db7;
          }
          .form-card p {
            margin-top: 1rem; color: #2563eb; cursor: pointer;
          }
          .form-card p:hover { text-decoration: underline; }
        `}
      </style>
    </div>
  );
}
