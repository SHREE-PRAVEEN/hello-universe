"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import styles from "./auth-panel.module.css";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@hello-universe.dev");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loggedIn = useMemo(() => typeof window !== "undefined" && !!localStorage.getItem("hu_token"), []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "register") {
        await apiClient.register({ name, email, password });
      }

      const result = await apiClient.login({ email, password });
      localStorage.setItem("hu_token", result.token);
      setMessage("Authenticated successfully. You can now add to cart and place orders.");
    } catch {
      setMessage("Authentication failed. Try another email or password.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("hu_token");
    setMessage("Logged out.");
    location.reload();
  };

  return (
    <section className={`p-4 ${styles.panel}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Account</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setMode("login")}
            className={`px-2 py-1 ${styles.modeButton} ${mode === "login" ? styles.modeActive : ""}`}
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`px-2 py-1 ${styles.modeButton} ${mode === "register" ? styles.modeActive : ""}`}
            type="button"
          >
            Register
          </button>
          <button onClick={logout} className={`px-2 py-1 ${styles.modeButton}`} type="button">
            Logout
          </button>
        </div>
      </div>

      {!loggedIn ? (
        <form onSubmit={onSubmit} className="grid gap-2 md:grid-cols-3">
          {mode === "register" ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={`rounded px-3 py-2 text-sm ${styles.input}`}
            />
          ) : null}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`rounded px-3 py-2 text-sm ${styles.input}`}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className={`rounded px-3 py-2 text-sm ${styles.input}`}
          />
          <button
            type="submit"
            className={`rounded px-4 py-2 text-sm disabled:opacity-60 ${styles.submit}`}
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register + Login"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-emerald-300">Authenticated. Token is set in localStorage.</p>
      )}

      {message ? <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{message}</p> : null}
    </section>
  );
}
