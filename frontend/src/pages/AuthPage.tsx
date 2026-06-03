import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../api/auth";

type Props = {
  onAuthSuccess: (token: string) => void;
};

function AuthPage({ onAuthSuccess }: Props) {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("test2@example.com");
  const [password, setPassword] = useState("testpassword123");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const authAction = mode === "login" ? loginUser : registerUser;

    authAction({ email, password })
      .then((data) => {
        localStorage.setItem("authToken", data.access_token);
        onAuthSuccess(data.access_token);
        navigate("/");
      })
      .catch(() => {
        setError(mode === "login" ? "Login failed" : "Registration failed");
      });
  }

  return (
    <main>
      <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-submit-button" type="submit">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        className="auth-mode-button"
        onClick={() => {
          setError("");
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Sign in"}
      </button>
    </main>
  );
}

export default AuthPage;