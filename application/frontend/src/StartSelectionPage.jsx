import React from "react";

function StartSelectionPage({ onSelectUser, onSelectAdmin }) {
  const cardStyle = {
    width: "200px",
    height: "220px",
    padding: "20px",
    cursor: "pointer",
    border: "none",
    borderRadius: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    fontSize: "18px",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fdf6e3",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{ marginBottom: "50px", color: "#5d4037", fontSize: "2.5rem" }}
      >
        おやつレコメンド
      </h1>
      <div style={{ display: "flex", gap: "30px" }}>
        <button
          onClick={onSelectUser}
          style={cardStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: "50px", marginBottom: "10px" }}>🍰</span>
          おやつを探す
          <br />
          <small style={{ fontWeight: "normal" }}>ユーザー用</small>
        </button>
        <button
          onClick={onSelectAdmin}
          style={{ ...cardStyle, backgroundColor: "#f0f0f0" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: "50px", marginBottom: "10px" }}>⚙️</span>
          在庫を管理する
          <br />
          <small style={{ fontWeight: "normal" }}>管理者用</small>
        </button>
      </div>
    </div>
  );
}
export default StartSelectionPage;
