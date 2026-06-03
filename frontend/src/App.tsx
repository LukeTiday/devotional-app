import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { fetchMe } from "./api/auth";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PlanPage from "./pages/PlanPage";
import AuthPage from "./pages/AuthPage";

import type { AuthUser } from "./api/auth";

function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    fetchMe(token)
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  }

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans/:slug" element={<PlanPage />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={setToken} />} />
      </Route>
    </Routes>
  );
}

export default App;