import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function Home({ currentTheme, isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) setUsername(user.username);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
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
        <div
          className="flex align-items-center cursor-pointer"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
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
        <div
          className="p-4 border-round-lg surface-card text-center"
          style={{
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          <h2
            style={{
              color: currentTheme.textColor,
              marginBottom: "1rem",
            }}
          >
            Welcome, {username || "User"}!
          </h2>
          <p
            style={{
              marginBottom: "2rem",
              color:
                currentTheme.textColor === "#ffffff" ? "#cccccc" : "#666666",
            }}
          >
            You are logged in.
          </p>
          <Button
            label="Logout"
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: currentTheme.textColor,
              borderColor: currentTheme.textColor,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />
        </div>
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
