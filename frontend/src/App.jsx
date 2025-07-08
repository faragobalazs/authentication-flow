import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "./App.scss";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

function LoginForm({
  currentTheme,
  isDark,
  toggleTheme,
  username,
  setUsername,
  password,
  setPassword,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(searchParams.get("message") || "");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");

  // If already logged in, redirect
  if (localStorage.getItem("isLoggedIn") === "true") {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Email is required for registration");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("You have successfully registered.");
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setIsRegistering(false);
      } else {
        setError(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const toggleRegisterMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setSuccess("");
    if (!isRegistering) {
      setEmail("");
    }
  };

  return (
    <div
      className="flex flex-column min-h-screen w-full"
      style={{ background: currentTheme.background }}
      data-theme={isDark ? "dark" : "light"}
    >
      {/* Header */}
      <header
        className="flex align-items-center justify-content-between w-full px-4"
        style={{
          height: "50px",
          background: currentTheme.background,
          color: currentTheme.headerText,
        }}
      >
        <div className="flex align-items-center">
          <i className="pi pi-lock mr-2" style={{ fontSize: "1.5rem" }}></i>
          <span className="font-bold text-lg">Jordan Apps | AuthFlow</span>
        </div>
        <button
          onClick={toggleTheme}
          className="flex align-items-center justify-content-center"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            color: currentTheme.headerText,
          }}
        >
          <i className={isDark ? "pi pi-sun" : "pi pi-moon"}></i>
        </button>
      </header>
      {/* Main Content */}
      <main
        className="flex flex-1 align-items-center justify-content-center w-full"
        style={{ background: currentTheme.background }}
      >
        <form
          className="p-4 border-round-lg surface-card"
          style={{
            minWidth: 320,
            maxWidth: 360,
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            "--input-bg": currentTheme.formBg,
            "--input-color": currentTheme.textColor,
            "--input-border":
              currentTheme.formBg === "#ffffff" ? "#e0e0e0" : "#666666",
          }}
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          <h2
            className="mb-4"
            style={{ color: currentTheme.textColor, textAlign: "center" }}
          >
            {isRegistering ? "Register" : "Login"}
          </h2>
          <div className="field mb-3">
            <label
              htmlFor="username"
              className="block mb-2"
              style={{ color: currentTheme.textColor }}
            >
              Username
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              autoComplete="username"
            />
          </div>
          {isRegistering && (
            <div className="field mb-3">
              <label
                htmlFor="email"
                className="block mb-2"
                style={{ color: currentTheme.textColor }}
              >
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                autoComplete="email"
              />
            </div>
          )}
          <div className="field mb-3">
            <label
              htmlFor="password"
              className="block mb-2"
              style={{ color: currentTheme.textColor }}
            >
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              feedback={false}
              toggleMask={false}
              autoComplete={isRegistering ? "new-password" : "current-password"}
            />
          </div>
          <Button
            label={
              loading
                ? isRegistering
                  ? "Creating Account..."
                  : "Logging in..."
                : isRegistering
                ? "Register"
                : "Login"
            }
            className="w-full mb-3"
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "transparent",
              color: currentTheme.textColor,
              borderColor: currentTheme.textColor,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />
          {error && (
            <div style={{ color: "red", marginBottom: 8, textAlign: "center" }}>
              {error}
            </div>
          )}
          {success && (
            <div
              style={{ color: "green", marginBottom: 8, textAlign: "center" }}
            >
              {success}
            </div>
          )}
          <Button
            label={isRegistering ? "Back to Login" : "Register"}
            className="w-full mb-3"
            type="button"
            onClick={toggleRegisterMode}
            style={{
              backgroundColor: "transparent",
              color: currentTheme.textColor,
              borderColor: currentTheme.textColor,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />
          <div className="flex gap-2">
            <Button
              label="Forgot Password"
              className="flex-1"
              type="button"
              onClick={() => navigate("/forgot-password")}
              style={{
                backgroundColor: "transparent",
                color: currentTheme.textColor,
                borderColor: currentTheme.textColor,
                borderWidth: "1px",
                borderStyle: "solid",
                fontSize: "0.875rem",
              }}
            />
            <Button
              label="Reset Password"
              className="flex-1"
              type="button"
              onClick={() => navigate("/reset-password")}
              style={{
                backgroundColor: "transparent",
                color: currentTheme.textColor,
                borderColor: currentTheme.textColor,
                borderWidth: "1px",
                borderStyle: "solid",
                fontSize: "0.875rem",
              }}
            />
          </div>
        </form>
      </main>
      {/* Footer */}
      <footer
        className="flex align-items-center justify-content-center w-full"
        style={{
          height: "35px",
          background: currentTheme.background,
          color: currentTheme.footerText,
        }}
      >
        <span>&copy; {new Date().getFullYear()} Balazs Farago</span>
      </footer>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const themeStyles = {
    dark: {
      background: "#1a1a1a",
      formBg: "#484848",
      textColor: "#ffffff",
      headerText: "#ffffff",
      footerText: "#cccccc",
      shadow: "0 4px 20px rgba(130, 130, 130, 0.25",
    },
    light: {
      background: "#ffffff",
      formBg: "#ffffff",
      textColor: "#000000",
      headerText: "#333333",
      footerText: "#6c757d",
      shadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
    },
  };

  const currentTheme = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginForm
              currentTheme={currentTheme}
              isDark={isDark}
              toggleTheme={toggleTheme}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
