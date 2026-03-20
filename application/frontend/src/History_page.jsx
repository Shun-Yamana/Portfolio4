import React from 'react';

function HistoryPage({ user }) {
  return (
    <div className="moods-page">
      <header className="moods-page__header">
        <h1 className="moods-page__title">履歴</h1>
        <p className="moods-page__subtitle">{user?.name}さんの履歴（準備中）</p>
      </header>
      <section className="moods-list" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>ここに過去に選んだ商品が表示されます。</p>
      </section>
    </div>
  );
}

export default HistoryPage;