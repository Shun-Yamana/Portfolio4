import React, { useState } from 'react';
import UserCard from './components/users_card';
import usersData from './data/users.json'; 

function RoleSelectionPage({ onSelectRole }) {
  // 選択されたユーザーのIDを1つだけ保存する（複数選択不可）
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserSelect = (user) => {
    // クリックされたユーザーのIDをセット
    setSelectedUserId(user.id);
  };

  const handleUserLogin = async () => {
    if (!selectedUserId) {
      alert("ユーザーを選択してください");
      return;
    }

    try {
      // バックエンドの /api/login にユーザーIDを送信
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: selectedUserId }),
      });

      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }

      const data = await response.json();
      console.log('ログイン成功:', data);

      // 成功したら親コンポーネント(main.jsx)に通知
      // 今回は 'user' という権限情報と一緒に、selectedUserId も渡します
      onSelectRole('user', selectedUserId);

    } catch (error) {
      alert("通信エラーが発生しました: " + error.message);
    }
  };

  return (
    <div className="moods-page">
      <header className="moods-page__header">
        <h1 className="moods-page__title">ログイン</h1>
        <p className="moods-page__subtitle">利用するユーザー、または管理者を選択してください</p>
      </header>
      
      {/* ユーザー選択エリア */}
      <section className="moods-list">
        {usersData.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            isSelected={selectedUserId === user.id}
            onClick={() => handleUserSelect(user)}
          />
        ))}
      </section>

      {/* ボタンエリア */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '40px' }}>
        <button 
          className="moods-page__next-btn" 
          onClick={handleUserLogin}
        >
          選択したユーザーでログイン
        </button>
        
        <button 
          className="moods-page__next-btn" 
          style={{ backgroundColor: '#555' }} 
          onClick={() => onSelectRole('admin')}
        >
          管理者として利用する
        </button>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
