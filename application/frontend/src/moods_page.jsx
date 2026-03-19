import { useState } from 'react';
import MoodsCard from './components/moods_card';
import moods from './data/moods.json';

function MoodsPage({ onChoose }) {
  // 【追加】選択された気分のIDを配列（リスト）で保存するState
  const [selectedMoods, setSelectedMoods] = useState([]);

  // 【追加】カードがクリックされた時の処理（選択・解除の切り替え）
  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood.id)) {
      // すでに選ばれていたら、リストから外す
      setSelectedMoods(selectedMoods.filter(id => id !== mood.id));
    } else {
      // まだ選ばれていなければ、リストに追加する
      setSelectedMoods([...selectedMoods, mood.id]);
    }
  };

  // 【追加】「次へ」ボタンが押された時の処理
  const handleNext = () => {
    if (selectedMoods.length === 0) {
      alert("気分を1つ以上選択してください");
      return;
    }

    const moodTags = moods
      .filter((m) => selectedMoods.includes(m.id))
      .map((m) => m.name);

    onChoose(moodTags);
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
