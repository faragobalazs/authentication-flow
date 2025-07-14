import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function ForgotPassword({ currentTheme, isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset email sent! Check your inbox.");
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch {
      setError("Server error");
    }
    setLoading(false);
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
        <form
          onSubmit={handleSubmit}
          className="p-4 border-round-lg surface-card"
          style={{
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            width: "100%",
            maxWidth: "400px",
            "--input-bg": currentTheme.formBg,
            "--input-color": currentTheme.textColor,
            "--input-border":
              currentTheme.formBg === "#ffffff" ? "#e0e0e0" : "#666666",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              color: currentTheme.textColor,
            }}
          >
            Forgot Password
          </h2>

          {success && (
            <div
              style={{
                color: "green",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {success}
            </div>
          )}

          <p
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              color:
                currentTheme.textColor === "#ffffff" ? "#cccccc" : "#666666",
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

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
              required
            />
          </div>

          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <Button
            label={loading ? "Sending..." : "Send Reset Email"}
            type="submit"
            className="w-full mb-3"
            disabled={loading}
            style={{
              backgroundColor: "transparent",
              color: currentTheme.textColor,
              borderColor: currentTheme.textColor,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <Button
              label="Back to Login"
              type="button"
              className="w-full"
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "transparent",
                color: currentTheme.textColor,
                borderColor: currentTheme.textColor,
                borderWidth: "1px",
                borderStyle: "solid",
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
