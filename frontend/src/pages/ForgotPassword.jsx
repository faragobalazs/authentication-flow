import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function ForgotPassword() {
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
        // In development mode, show the reset URL
        if (data.resetUrl) {
          setSuccess(`Password reset email sent! Reset URL: ${data.resetUrl}`);
        }
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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
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
          Forgot Password
        </h2>

        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
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
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}

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

        <Button
          label={loading ? "Sending..." : "Send Reset Email"}
          type="submit"
          className="w-full"
          disabled={loading}
          style={{ marginBottom: "1rem" }}
        />

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
