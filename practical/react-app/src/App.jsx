import { useAuth } from "./auth/AuthContext.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return null;
  // Protected UI: Dashboard renders only for an authenticated user.
  return user ? <Dashboard /> : <LoginForm />;
}
