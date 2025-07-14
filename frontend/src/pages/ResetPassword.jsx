import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function ResetPassword({ currentTheme, isDark, toggleTheme }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus("invalid");
        setMessage("No token provided.");
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3000/api/verify-reset-token/${token}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("valid");
          setEmail(data.email);
        } else {
          setStatus("invalid");
          setMessage(data.error || "Invalid or expired token.");
        }
      } catch {
        setStatus("invalid");
        setMessage("Server error.");
      }
    }
    verifyToken();
  }, [token]);

  async function handleReset(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setMessage("Password reset successfully. You can now log in.");
      } else {
        setMessage(data.error || "Reset failed.");
      }
    } catch {
      setMessage("Server error.");
    }
  }

  const renderContent = () => {
    if (status === "verifying") {
      return (
        <div
          className="p-4 border-round-lg surface-card"
          style={{
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            textAlign: "center",
            color: currentTheme.textColor,
          }}
        >
          Verifying token...
        </div>
      );
    }

    if (status === "invalid") {
      return (
        <div
          className="p-4 border-round-lg surface-card"
          style={{
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            textAlign: "center",
            color: currentTheme.textColor,
          }}
        >
          <div style={{ color: "red", marginBottom: "1rem" }}>{message}</div>
          <Button
            label="Back to Login"
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
      );
    }

    if (status === "done") {
      return (
        <div
          className="p-4 border-round-lg surface-card"
          style={{
            background: currentTheme.formBg,
            boxShadow: currentTheme.shadow,
            textAlign: "center",
            color: currentTheme.textColor,
          }}
        >
          <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>
          <Button
            label="Go to Login"
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
      );
    }

    return (
      <form
        onSubmit={handleReset}
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
            marginBottom: "2rem",
            color: currentTheme.textColor,
          }}
        >
          Reset Password
        </h2>
        <div
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            color: currentTheme.textColor,
          }}
        >
          Account: <b>{email}</b>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="newPassword"
            className="block mb-2"
            style={{ color: currentTheme.textColor }}
          >
            New Password
          </label>
          <Password
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
            feedback={false}
            toggleMask={false}
            required
          />
        </div>

        <Button
          label="Set New Password"
          type="submit"
          className="w-full mb-3"
          style={{
            backgroundColor: "transparent",
            color: currentTheme.textColor,
            borderColor: currentTheme.textColor,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        />

        {message && (
          <div
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {message}
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <Button
            label="Back to Login"
            type="button"
            link
            onClick={() => navigate("/")}
            style={{
              color: currentTheme.textColor,
            }}
          />
        </div>
      </form>
    );
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
        {renderContent()}
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
