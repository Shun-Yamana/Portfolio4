import MoodsCard from './components/moods_card';
import moods from './data/moods.json';

function MoodsPage() {
  return (
    <div className="moods-page">
      <header className="moods-page__header">
        <h1 className="moods-page__title">今の気分は？</h1>
        <p className="moods-page__subtitle">当てはまるものを選択してください</p>
      </header>
      
      {/* 縦1列に並べるためのコンテナ */}
      <section className="moods-list">
        {moods.map((mood) => (
          <MoodsCard
            key={mood.id}
            name={mood.name}
          />
        ))}
      </section>
    </div>
  );
}

export default MoodsPage;
