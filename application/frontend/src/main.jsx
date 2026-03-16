import React from 'react'
import ReactDOM from 'react-dom/client'
import RecomendPage from './recomend_page'
import './index.css'
import ProductsPage from './Products_page'
import MoodsPage from './moods_page'
import './moods.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MoodsPage/>
    <ProductsPage/>
    <RecomendPage/>
  </React.StrictMode>
)
