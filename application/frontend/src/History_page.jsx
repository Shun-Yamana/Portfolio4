import React, { useState, useEffect } from 'react';
import ProductsCard from './components/products_card';

// 画像のインポート（Products_page.jsxと同じもの）
import crispyChickenImage from './assets/unnamed.jpg';
import cheeseHashImage from './assets/unnamed (1).jpg';
import custardChouxImage from './assets/unnamed (2).jpg';

const productImages = {
  'custard-choux': crispyChickenImage,
  'cheese-hash': cheeseHashImage,
  'crispy-chicken': custardChouxImage,
};

function HistoryPage({ user, onChoose }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ユーザー情報がない場合は処理しない
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        // バックエンドの履歴APIを呼び出す
        const response = await fetch(`http://localhost:5001/api/history?user_id=${user.id}`);
        if (!response.ok) {
          throw new Error('履歴の取得に失敗しました');
        }
        
        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // 読み込み中・エラー時の表示
  if (isLoading) return <div className="products-page"><p>読み込み中...</p></div>;
  if (error) return <div className="products-page"><p className="products-page__error">エラー: {error}</p></div>;

  return (
    <div className="products-page">
      <header className="products-page__header">
        <p className="products-page__eyebrow">History</p>
        <h1 className="products-page__title">{user?.name}さんの購入履歴</h1>
      </header>
      
      {history.length === 0 ? (
        <p>購入履歴がありません。</p>
      ) : (
        <section className="products-grid">
          {history.map((item, index) => (
            <ProductsCard
              // 同じ商品を複数回買うことも想定し、keyにindexを混ぜて一意にする
              key={`${item.id}-${index}`}
              name={item.name}
              price={item.price}
              // 商品説明の代わりに購入日時等を表示すると履歴っぽくなります
              description={`購入日: ${item.purchased_at} / ${item.description}`}
              image={productImages[item.image] || custardChouxImage}
              alt={item.alt || item.name}
              
              // 履歴画面用のボタンアクション（空の関数にするか、再購入用のアラートを入れる）
              onConsider={() => alert('履歴からは「気になる」に追加できません')}
              onChoose={() => {
                if (item.stock <= 0) {
                  alert('申し訳ありません。この商品は現在在庫切れです。');
                  return; // returnすることで、親のonChooseが呼ばれず画面遷移を防ぎます
                }
                
                onChoose({
                  ...item,
                  reason: '以前も選んだお気に入りの商品ですね！今日の気分にもぴったりです。'
                });
              }}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default HistoryPage;