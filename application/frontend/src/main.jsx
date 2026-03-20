import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import ProductsPage from './Products_page'
import './index.css'
import RecomendPage from './recomend_page'
import MoodsPage from './moods_page'
import './moods.css'
import RoleSelectionPage from './roleSelection_page' // 【追加】インポート

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
  const [moodData, setMoodData] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // 最初に役割選択画面を表示
  if (!role) {
    return <RoleSelectionPage onSelectRole={setRole} />
  }

  // 管理者が選ばれた場合の仮画面
  if (role === 'admin') {
    return (
      <div className="moods-page">
        <h1 className="moods-page__title">管理者ページ（準備中）</h1>
        <button className="moods-page__next-btn" onClick={() => setRole(null)}>戻る</button>
      </div>
    )
  }

  // ===== これ以降はユーザー向けのフロー =====
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