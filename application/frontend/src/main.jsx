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
import AdminLoginPage from './AdminLoginPage' // 【追加】ログインページをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
)


function AppRoot() {
  const [role, setRole] = useState(null) // 'user' | 'admin' | null
  const [currentUser, setCurrentUser] = useState(null) 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false) // 【追加】管理者のログイン状態

  const [activeTab, setActiveTab] = useState('mood') // 'mood' | 'history'

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
      setSelectedProduct(null)
      setMoodData(null)
    } else if (tab === 'history') {
      setSelectedProduct(null)
    }
  }

  const handleChooseProduct = (product) => {
    setSelectedProduct(product)
    setActiveTab('mood') 
  }

  // 1. 最初に役割選択画面を表示
  if (!role) {
    return <RoleSelectionPage onSelectRole={handleSelectRole} />
  }

  // 2. 管理者フロー（ログイン画面を挟む）
  if (role === 'admin') {
    // まだログインしていなければログイン画面を表示
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onBack={() => setRole(null)} // 戻るボタンで役割選択へ
        />
      )
    }
    // ログイン成功後は実際の管理者ページを表示
    return (
      <AdminPage 
        onBack={() => {
          setRole(null)
          setIsAdminLoggedIn(false) // 戻る際にログアウト状態に戻す
        }} 
      />
    )
  }

  // 3. ユーザー向けのコンテンツ部分（タブによって切り替え）
  const renderUserContent = () => {
    if (activeTab === 'history') {
      return <HistoryPage user={currentUser} onChoose={handleChooseProduct} />
    }

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