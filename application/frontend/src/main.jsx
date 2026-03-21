import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import ProductsPage from "./Products_page";
import RecomendPage from "./recomend_page";
import MoodsPage from "./moods_page";
import AdminPage from "./AdminPage";
import AdminLoginPage from "./AdminLoginPage";
import StartSelectionPage from "./StartSelectionPage";
import "./index.css";
import "./moods.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);

function AppRoot() {
  const [appMode, setAppMode] = useState("start"); // 'start', 'user', 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [moodData, setMoodData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. 管理者フロー
  if (appMode === "admin") {
    if (!isLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setIsLoggedIn(true)}
          onBack={() => setAppMode("start")}
        />
      );
    }
    return (
      <AdminPage
        onExit={() => {
          setAppMode("start");
          setIsLoggedIn(false);
        }}
      />
    );
  }

  // 2. ユーザーフロー
  if (appMode === "user") {
    if (selectedProduct) {
      return <RecomendPage product={selectedProduct} />;
    }
    if (moodData) {
      return (
        <ProductsPage initialData={moodData} onChoose={setSelectedProduct} />
      );
    }
    return <MoodsPage onChoose={setMoodData} />;
  }

  // 3. 初期画面（どっちで入るか選択）
  return (
    <StartSelectionPage
      onSelectUser={() => setAppMode("user")}
      onSelectAdmin={() => setAppMode("admin")}
    />
  );
}
