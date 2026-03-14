import ProductsCard from './components/products_card'
import products from './data/products.json'
import crispyChickenImage from './assets/unnamed.jpg'
import cheeseHashImage from './assets/unnamed (1).jpg'
import custardChouxImage from './assets/unnamed (2).jpg'

const productImages = {
  'custard-choux': crispyChickenImage,
  'cheese-hash': cheeseHashImage,
  'crispy-chicken': custardChouxImage,
}

function ProductsPage() {
  return (
    <div className="products-page">
      <header className="products-page__header">
        <h1 className="products-page__title">おすすめ3選</h1>
      </header>
      <section className="products-grid">
        {products.map((product) => (
          <ProductsCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={productImages[product.image]}
            alt={product.alt}
          />
        ))}
      </section>
    </div>
  )
}

export default ProductsPage
