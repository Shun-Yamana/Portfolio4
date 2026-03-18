import { useState } from 'react';
import MoodsCard from './components/moods_card';
import moods from './data/moods.json';

function MoodsPage({ onChoose }) {
  const [selectedMoods, setSelectedMoods] = useState([]);

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood.id)) {
      // すでに選ばれていたら、リストから外す
      setSelectedMoods(selectedMoods.filter(id => id !== mood.id));
    } else {
      // まだ選ばれていなければ、リストに追加する
      setSelectedMoods([...selectedMoods, mood.id]);
    }
  };

  const handleNext = async () => {
    if (selectedMoods.length > 0) {
      try {
        // バックエンドに選択された気分の配列を送信
        const response = await fetch('http://localhost:8000/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ moods: selectedMoods }),
        });

        if (!response.ok) {
          throw new Error('商品の取得に失敗しました');
        }

        // バックエンドでの計算結果（おすすめ商品リスト）を受け取る
        const recommendedProducts = await response.json();
        
        // 受け取った商品リストを親(main.jsx)に渡して画面遷移
        onChoose(recommendedProducts);
        
      } catch (error) {
        alert("エラーが発生しました: " + error.message);
      }
    } else {
      alert("気分を1つ以上選択してください");
    }
  };

  return (
    <div className="moods-page">
      <header className="moods-page__header">
        <h1 className="moods-page__title">今の気分は？</h1>
        {/* 文言を少し変更 */}
        <p className="moods-page__subtitle">当てはまるものを選択してください（複数選択可）</p>
      </header>
      
      <section className="moods-list">
        {moods.map((mood) => (
          <MoodsCard
            key={mood.id}
            name={mood.name}
            // 【変更】選択中かどうか（true/false）と、クリック時の関数を渡す
            isSelected={selectedMoods.includes(mood.id)}
            onClick={() => toggleMood(mood)}
          />
        ))}
      </section>

      {/* 【追加】次へボタン */}
      <button className="moods-page__next-btn" onClick={handleNext}>
        次へ進む
      </button>
    </div>
  );
}

export default MoodsPage;
