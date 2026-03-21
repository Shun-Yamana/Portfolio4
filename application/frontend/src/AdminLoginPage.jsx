const handleLogin = (e) => {
  e.preventDefault();

  // 1. 現在の時刻を取得
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0"); // 9時なら "09"
  const minutes = String(now.getMinutes()).padStart(2, "0"); // 7分なら "07"

  // 2. 正解のパスワードを生成 (例: admin123 + 09 + 07 = admin1230907)
  const dynamicPassword = `admin123${hours}${minutes}`;

  // 3. 判定
  if (password === dynamicPassword) {
    onLoginSuccess();
  } else {
    // ヒントとして、今の正解をコンソールに出しておくとデバッグが楽です（本番では消してください）
    console.log("Expected password:", dynamicPassword);
    setError("パスワードが違います（時間を含めて入力してください）");
    setPassword("");
  }
};
