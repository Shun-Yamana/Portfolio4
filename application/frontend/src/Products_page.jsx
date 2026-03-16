import { useEffect, useState } from 'react'
import ProductsCard from './components/products_card'
import fallbackProducts from './data/products.json'
import crispyChickenImage from './assets/unnamed.jpg'
import cheeseHashImage from './assets/unnamed (1).jpg'
import custardChouxImage from './assets/unnamed (2).jpg'

const productImages = {
  'custard-choux': crispyChickenImage,
  'cheese-hash': cheeseHashImage,
  'crispy-chicken': custardChouxImage,
}

function ProductsPage({ onChoose }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:8000/products'

  useEffect(() => {

    if (!API_URL) {
      return
    }

    let isMounted = true

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('商品の取得に失敗しました。')
        }
        const data = await response.json()
        if (isMounted) {
          setProducts(data)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('商品の取得に失敗しました。')
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSelect = async (product) => {
    try {
      const response = await fetch(`${API_URL}/selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      if (!response.ok) {
        throw new Error('商品の送信に失敗しました。')
      }
      const data = await response.json()
      setProducts(data)
      setError('')
    } catch (selectError) {
      setError('商品の送信に失敗しました。')
    }
  }

  const handleChoose = async (product) => {
    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      if (!response.ok) {
        throw new Error('レコメンドの取得に失敗しました。')
      }
      const data = await response.json()
      onChoose(data)
      setError('')
    } catch (chooseError) {
      setError('レコメンドの取得に失敗しました。')
    }
  }

  return (
    <div className="products-page">
      <header className="products-page__header">
        <h1 className="products-page__title">おすすめ3選</h1>
      </header>
      {error && <p className="products-page__error">{error}</p>}
      <section className="products-grid">
        {products.map((product) => (
          <ProductsCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={productImages[product.image]}
            alt={product.alt}
            onConsider={() => handleSelect(product)}
            onChoose={() => handleChoose(product)}
          />
        ))}
      </section>
    </div>
  )
}

export default ProductsPage
