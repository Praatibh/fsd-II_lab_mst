import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginForm() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login(username.trim(), password);
  }

  return (
    <main className="center">
      <form className="panel" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <p className="muted">Use a demo account: admin / admin123 or user / user123.</p>

        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
               autoComplete="username" required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password}
               onChange={(e) => setPassword(e.target.value)}
               autoComplete="current-password" required />

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </main>
  );
}
