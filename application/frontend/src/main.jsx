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
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (selectedProduct) {
    return <RecomendPage product={selectedProduct} />
  }

  if (selectedMood) {
    return (
      <ProductsPage 
        mood={selectedMood} 
        onChoose={setSelectedProduct} 
      />
    )
  }

  return <MoodsPage onChoose={setSelectedMood} />
}
