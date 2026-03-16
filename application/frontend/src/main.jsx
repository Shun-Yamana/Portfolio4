import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import ProductsPage from './Products_page'
import './index.css'
import RecomendPage from './recomend_page'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
)

function AppRoot() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (selectedProduct) {
    return <RecomendPage product={selectedProduct} />
  }

  return <ProductsPage onChoose={setSelectedProduct} />
}
