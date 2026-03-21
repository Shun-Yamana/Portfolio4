import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import ProductsPage from './Products_page'
import './index.css'
import RecomendPage from './recomend_page'
import MoodsPage from './moods_page'
import './moods.css'
import RoleSelectionPage from './roleSelection_page' // 【追加】インポート
import HistoryPage from './History_page' // 【追加】履歴ページをインポート
import AdminPage from './admin_page' // 【追加】管理者ページをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
)
/*
function AppRoot() {
  // 【修正】気分データ（複数の情報を含む）を保存するように変更
  const [moodData, setMoodData] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (selectedProduct) {
    return <RecomendPage product={selectedProduct} />
  }

  // 気分データが存在すれば ProductsPage を表示
  if (moodData) {
    return (
      <ProductsPage 
        initialData={moodData}
        onChoose={setSelectedProduct} 
      />
    )
  }

  return <MoodsPage onChoose={setMoodData} />
}
*/


function AppRoot() {
  const [role, setRole] = useState(null) // 'user' | 'admin' | null
  const [currentUser, setCurrentUser] = useState(null) // 【追加】現在ログインしているユーザー情報

  const [activeTab, setActiveTab] = useState('mood') // 【追加】'mood' | 'history'

  const [moodData, setMoodData] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // 役割とユーザー情報を受け取るハンドラー
  const handleSelectRole = (selectedRole, userId, userName) => {
    setRole(selectedRole)
    if (selectedRole === 'user') {
      setCurrentUser({ id: userId, name: userName })
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'mood') {
      // 気分タブを押し直したら、最初からやり直せるようにリセット
      setSelectedProduct(null)
      setMoodData(null)
    } else if (tab === 'history') {
      // 履歴を見る時は、選択中の商品をクリア
      setSelectedProduct(null)
    }
  }

  const handleChooseProduct = (product) => {
    setSelectedProduct(product)
    setActiveTab('mood') // 履歴から選んだ場合も、タブの見た目をメインに戻す
  }
  // 最初に役割選択画面を表示
  if (!role) {
    return <RoleSelectionPage onSelectRole={handleSelectRole} />
  }

  // 管理者が選ばれた場合の仮画面
  if (role === 'admin') {
    return <AdminPage onBack={() => setRole(null)} /> // 【書き換え】仮画面から本物のAdminPageに
  }

  // ===== ユーザー向けのコンテンツ部分（タブによって切り替え） =====
  const renderUserContent = () => {
    // 履歴タブの場合
    if (activeTab === 'history') {
      return <HistoryPage user={currentUser} onChoose={handleChooseProduct} />
    }

    // 気分タブの場合
    if (selectedProduct) {
      return <RecomendPage product={selectedProduct} />
    }

    if (moodData) {
      return (
        <ProductsPage 
          initialData={moodData}
          onChoose={setSelectedProduct} 
        />
      )
    }

    return <MoodsPage onChoose={setMoodData} />
  }

  return (
   <div className="app-container">
      {/* クラス名を付与してCSSで余白を管理します */}
      <div className="main-content">
        {renderUserContent()}
      </div>
      
      {/* ボトムナビゲーション */}
      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${activeTab === 'mood' ? 'active' : ''}`}
          onClick={() => handleTabChange('mood')}
        >
          気分
        </button>
        <button 
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          履歴
        </button>
      </nav>
    </div>
  )
}