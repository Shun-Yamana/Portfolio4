import React, { useState, useEffect } from "react";

// 商品マスターデータ（本来はDBから取得するのが理想ですが、一旦ここで定義）
const PRODUCTS = [
  { id: "choco-cornet", name: "チョココロネ", price: 138 },
  { id: "tiramisu", name: "ティラミス", price: 298 },
  { id: "lemon-tart", name: "レモンタルト", price: 248 },
  { id: "cheesecake", name: "濃厚チーズケーキ", price: 248 },
  { id: "apple-pie", name: "アップルパイ", price: 228 },
  { id: "mont-blanc", name: "モンブラン", price: 298 },
  { id: "pancake", name: "パンケーキ", price: 198 },
  { id: "donut", name: "ドーナツ", price: 148 },
  { id: "brownie", name: "ブラウニー", price: 178 },
  { id: "macaron", name: "マカロン", price: 178 },
  { id: "choux-cream", name: "シュークリーム", price: 138 },
  { id: "vanilla-ice", name: "バニラアイス", price: 148 },
  { id: "choco-ice", name: "チョコアイス", price: 148 },
  { id: "strawberry-short", name: "いちごショート", price: 298 },
  { id: "fruit-tart", name: "フルーツタルト", price: 348 },
];

function AdminPage({ onExit }) {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. 初期データの読み込み (GET) ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/inventory");
        const data = await res.json();

        // [{product_id: "...", stock: 10}, ...] を { "product_id": 10 } の形式に変換
        const stockMap = {};
        if (data.inventory) {
          data.inventory.forEach((item) => {
            stockMap[item.product_id] = item.stock;
          });
        }
        setStocks(stockMap);
      } catch (err) {
        console.error("在庫の取得に失敗しました:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // --- 2. 在庫数の更新ロジック ---
  const handleUpdate = (id, amount) => {
    setStocks((prev) => ({
      ...prev,
      // 在庫がマイナスにならないように Math.max(0, ...) を使用
      [id]: Math.max(0, (prev[id] || 0) + amount),
    }));
  };

  // --- 3. データの保存 (PATCH) ---
  const saveAll = async () => {
    setIsSaving(true);
    const items = Object.entries(stocks).map(([id, s]) => ({
      product_id: id,
      stock: s,
    }));

    try {
      const resp = await fetch("http://localhost:5001/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: 1, items }),
      });

      if (resp.ok) {
        alert("✅ 在庫情報を更新しました！");
      } else {
        throw new Error("保存失敗");
      }
    } catch (err) {
      alert("❌ 保存に失敗しました。サーバーの状態を確認してください。");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "100px",
          fontSize: "20px",
        }}
      >
        📡 データを読み込み中...
      </div>
    );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "sans-serif",
        backgroundColor: "#fdfdfd",
      }}
    >
      {/* ヘッダーエリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
          alignItems: "center",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>🏪 在庫管理パネル</h2>
        <button
          onClick={onExit}
          style={{
            padding: "8px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          終了して戻る
        </button>
      </div>

      {/* 在庫テーブル */}
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
              <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>
                商品名
              </th>
              <th
                style={{
                  padding: "15px",
                  borderBottom: "2px solid #eee",
                  textAlign: "center",
                }}
              >
                現在の個数
              </th>
              <th
                style={{
                  padding: "15px",
                  borderBottom: "2px solid #eee",
                  textAlign: "center",
                }}
              >
                クイック操作
              </th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => {
              const currentStock = stocks[p.id] || 0;
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>
                    {p.name}
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor:
                          currentStock === 0 ? "#ffebee" : "#e3f2fd",
                        color: currentStock === 0 ? "#c62828" : "#1565c0",
                        fontWeight: "bold",
                      }}
                    >
                      {currentStock} 個
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <button
                      onClick={() => handleUpdate(p.id, 1)}
                      style={actionBtnStyle}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdate(p.id, 10)}
                      style={actionBtnStyle}
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleUpdate(p.id, 100)}
                      style={actionBtnStyle}
                    >
                      +100
                    </button>
                    <button
                      onClick={() =>
                        setStocks((prev) => ({ ...prev, [p.id]: 0 }))
                      }
                      style={{
                        ...actionBtnStyle,
                        color: "#d32f2f",
                        borderColor: "#ffcdd2",
                      }}
                    >
                      完売
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 保存ボタン */}
      <div style={{ position: "sticky", bottom: "20px", marginTop: "30px" }}>
        <button
          onClick={saveAll}
          disabled={isSaving}
          style={{
            width: "100%",
            padding: "20px",
            backgroundColor: isSaving ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 10px 20px rgba(40, 167, 69, 0.3)",
          }}
        >
          {isSaving ? "保存中..." : "✅ 変更を確定してAWSに保存"}
        </button>
      </div>
    </div>
  );
}

// 共通ボタンスタイル
const actionBtnStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "#fff",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.1s",
};

export default AdminPage;
