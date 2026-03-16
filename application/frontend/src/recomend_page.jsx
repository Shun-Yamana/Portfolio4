import RecomendCard from './components/recomend'
import custardChouxImage from './assets/unnamed.jpg'
import cheeseHashImage from './assets/unnamed (1).jpg'
import crispyChickenImage from './assets/unnamed (2).jpg'

const recomendItems = [
  {
    id: 'custard-choux',
    name: 'とろけるカスタードシュー',
    description: '割った瞬間、クリームがあふれる。',
    price: 158,
    reason: '甘さ控えめのクリームで食後のデザートに最適。',
    image: custardChouxImage,
    alt: 'とろけるカスタードシューの写真',
  },
]

function RecomendPage() {
  return (
    <div className="recommend-page">
      <header className="recommend-page__header">
        <p className="recommend-page__eyebrow">おすすめセレクション</p>
        <h1 className="recommend-page__title">今日のレコメンド</h1>
      </header>
      <section className="recommend-grid">
        {recomendItems.map((item) => (
          <RecomendCard key={item.id} {...item} />
        ))}
      </section>
    </div>
  )
}

export default RecomendPage
