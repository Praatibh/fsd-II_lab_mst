import { useAuth } from "../auth/AuthContext.jsx";
import { decodeToken } from "../auth/jwt.js";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [h, p, s] = token.split(".");
  const decoded = decodeToken(token);

  return (
    <main className="center">
      <section className="panel wide">
        <header className="row">
          <h1>Dashboard</h1>
          <button className="ghost" onClick={logout}>Logout</button>
        </header>

        <p>Welcome, <strong>{user.username}</strong>.</p>
        <p>
          Your role: <span className={`badge ${user.role}`}>{user.role}</span>
          <span className="muted"> &nbsp;userId: {user.userId}</span>
        </p>

        {user.role === "admin" ? (
          <p className="note">Admin view: you can manage users and settings.</p>
        ) : (
          <p className="note">User view: you can see your own account details.</p>
        )}

        <p className="muted">
          Token expires at {new Date(user.exp * 1000).toLocaleTimeString()}.
        </p>

        <h2>Stored token</h2>
        <code className="token">
          <span className="t-h">{h}</span>.<span className="t-p">{p}</span>.<span className="t-s">{s}</span>
        </code>

        <h2>Decoded payload</h2>
        <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
      </section>
    </main>
  );
}
