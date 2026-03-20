import React, { useState, useEffect } from 'react'; // useEffectを追加
import UserCard from './components/users_card';

function RoleSelectionPage({ onSelectRole }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [usersData, setUsersData] = useState([]); // バックエンドから取得したユーザーを入れる場所
  const [isLoading, setIsLoading] = useState(true); // 読み込み中の状態管理
  const [error, setError] = useState(null); // エラー状態の管理

  // 画面が表示されたときに1回だけ実行される処理
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const data = await response.json();
        setUsersData(data); // 取得したデータをセット
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // 読み込み完了
      }
    };

    fetchUsers();
  }, []); // 空の配列を渡すことで、最初の1回だけ実行させます

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
  };

  const handleUserLogin = async () => {
    if (!selectedUserId) {
      alert("ユーザーを選択してください");
      return;
    }

    const selectedUser = usersData.find(user => user.id === selectedUserId);


    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: selectedUser.id, 
          name: selectedUser.name 
        }),
      });

      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }

      const data = await response.json();
      console.log('ログイン成功:', data);

      onSelectRole('user', selectedUserId);

    } catch (err) {
      alert("通信エラーが発生しました: " + err.message);
    }
  };

  // 読み込み中やエラー時の表示
  if (isLoading) return <div className="moods-page"><p>ユーザー情報を読み込み中...</p></div>;
  if (error) return <div className="moods-page"><p className="moods-page__error">エラー: {error}</p></div>;

  return (
    <div className="moods-page">
      <header className="moods-page__header">
        <h1 className="moods-page__title">ログイン</h1>
        <p className="moods-page__subtitle">利用するユーザー、または管理者を選択してください</p>
      </header>
      
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