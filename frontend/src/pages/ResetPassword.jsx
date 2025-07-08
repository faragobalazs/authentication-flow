import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function ResetPassword() {
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

  if (status === "verifying") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>Verifying token...</div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "red", marginBottom: "1rem" }}>{message}</div>
          <Button label="Back to Login" onClick={() => navigate("/")} />
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>
          <Button label="Go to Login" onClick={() => navigate("/")} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleReset}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Reset Password
        </h2>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          Account: <b>{email}</b>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="newPassword"
            style={{ display: "block", marginBottom: "0.5rem" }}
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
          className="w-full"
          style={{ marginBottom: "1rem" }}
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
          />
        </div>
      </form>
    </div>
  );
}
