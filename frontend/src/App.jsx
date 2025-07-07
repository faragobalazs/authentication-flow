import { useState } from "react";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "./App.scss";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

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
      shadow: "0 4px 20px rgba(120, 120, 120, 0.1",
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
    <div
      className="flex flex-column min-h-screen w-full"
      style={{ background: currentTheme.background }}
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
            background: currentTheme.background,
            boxShadow: currentTheme.shadow,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <h2
            className="mb-4"
            style={{ color: currentTheme.textColor, textAlign: "center" }}
          >
            Login
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
          <div className="field mb-4">
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
              toggleMask
              autoComplete="current-password"
            />
          </div>
          <Button label="Login" className="w-full" type="submit" />
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
        <span>&copy; {new Date().getFullYear()} AuthFlow</span>
      </footer>
    </div>
  );
}

export default App;
