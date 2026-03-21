import React, { useState } from "react";

const AdminLoginPage = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. 現在の時刻を取得
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // 2. 正解のパスワードを生成
    const dynamicPassword = `admin123${hours}${minutes}`;

    // 3. 判定
    if (password === dynamicPassword) {
      onLoginSuccess();
    } else {
      console.log("Expected password:", dynamicPassword);
      setError("パスワードが違います（時間を含めて入力してください）");
      setPassword("");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>管理者ログイン</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
        />
        <button type="submit">ログイン</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={onBack} style={{ marginTop: "10px" }}>戻る</button>
    </div>
  );
};

export default AdminLoginPage;