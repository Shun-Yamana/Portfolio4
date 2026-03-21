import React, { useState, useEffect } from 'react';

function AdminPage({ onBack }) {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 画面表示時に在庫データを取得
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/admin/inventory?store_id=1');
        if (!response.ok) throw new Error('在庫の取得に失敗しました');
        const data = await response.json();
        setInventory(data.inventory);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // ＋ーボタンを押した時の処理
  const handleStockChange = (productId, delta) => {
    setInventory(prevInventory =>
      prevInventory.map(item => {
        if (item.product_id === productId) {
          const newStock = Math.max(0, item.stock + delta); // 0未満にはならないようにする
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // 保存ボタンを押した時の処理
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 変更するデータの形式をバックエンドに合わせる
      const itemsToUpdate = inventory.map(item => ({
        product_id: item.product_id,
        stock: item.stock
      }));

      const response = await fetch('http://localhost:5001/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: 1, items: itemsToUpdate })
      });

      if (!response.ok) throw new Error('在庫の更新に失敗しました');
      
      alert('在庫を更新しました！');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="admin-page">読み込み中...</div>;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">在庫管理システム</h1>
        <button className="admin-btn admin-btn--ghost" onClick={onBack}>
          ← ログイン画面に戻る
        </button>
      </header>

      <div className="admin-grid">
        {inventory.map((item) => (
          <article key={item.product_id} className="admin-card">
            <div className="admin-card__image-wrap">
               {/* 実際の画像パスに合わせて拡張子を付与（必要に応じて変更してください） */}
              <img src={`/${item.image}.jpg`} alt={item.name} className="admin-card__image" />
            </div>
            
            <div className="admin-card__info">
              <h2 className="admin-card__name">{item.name}</h2>
              <p className="admin-card__price">¥{item.price}</p>
            </div>

            <div className="admin-card__stock-control">
              <button 
                className="stock-btn minus" 
                onClick={() => handleStockChange(item.product_id, -1)}
                disabled={item.stock <= 0}
              >
                ー
              </button>
              <span className="stock-count">{item.stock}</span>
              <button 
                className="stock-btn plus" 
                onClick={() => handleStockChange(item.product_id, 1)}
              >
                ＋
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-footer">
        <button 
          className="admin-btn admin-btn--primary" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '在庫を一括で登録する'}
        </button>
      </div>
    </div>
  );
}

export default AdminPage;