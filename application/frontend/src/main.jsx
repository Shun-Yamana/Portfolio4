import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import ProductsPage from './Products_page'
import './index.css'
import RecomendPage from './recomend_page'
import MoodsPage from './moods_page'
import './moods.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
)

function AppRoot() {
  // 【修正】気分ではなく、取得した「商品リスト(products)」を保存するように変更
  const [fetchedProducts, setFetchedProducts] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (selectedProduct) {
    return <RecomendPage product={selectedProduct} />
  }

  // 商品リストが存在すれば ProductsPage を表示
  if (fetchedProducts) {
    return (
      <ProductsPage 
        initialProducts={fetchedProducts} // 取得済みのデータを渡す
        onChoose={setSelectedProduct} 
      />
    )
  }

  return <MoodsPage onChoose={setFetchedProducts} />
}