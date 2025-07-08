import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function Home() {
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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <h2>Welcome, {username || "User"}!</h2>
        <p style={{ marginBottom: "2rem" }}>You are logged in.</p>
        <Button label="Logout" onClick={handleLogout} severity="secondary" />
      </div>
    </div>
  );
}
