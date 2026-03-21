import { useState } from 'react'
import RecomendCard from './components/recomend'
import custardChouxImage from './assets/unnamed.jpg'
import cheeseHashImage from './assets/unnamed (1).jpg'
import crispyChickenImage from './assets/unnamed (2).jpg'

const productImages = {
  'custard-choux': custardChouxImage,
  'cheese-hash': cheeseHashImage,
  'crispy-chicken': crispyChickenImage,
}

// テキストを折り返して描画するヘルパー
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('')
  let line = ''
  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i]
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      ctx.fillText(line, x, y)
      line = chars[i]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

// Canvas でシェア用カード画像を生成
async function generateShareImage(item, moodTags = []) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 660
  const ctx = canvas.getContext('2d')

  // 背景グラデーション
  const bg = ctx.createLinearGradient(0, 0, 600, 660)
  bg.addColorStop(0, '#fffaf3')
  bg.addColorStop(1, '#ffe4b5')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 600, 660)

  // 上部アクセントバー
  const bar = ctx.createLinearGradient(0, 0, 600, 0)
  bar.addColorStop(0, '#f2b06a')
  bar.addColorStop(1, '#e8845a')
  ctx.fillStyle = bar
  ctx.fillRect(0, 0, 600, 8)

  // アプリタイトル
  ctx.fillStyle = '#8c5a3b'
  ctx.font = '500 16px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🛒 今日のコンビニレコメンド', 300, 36)

  // 商品画像を読み込んで描画
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise((resolve) => {
    img.onload = resolve
    img.onerror = resolve
    img.src = item.image
  })
  if (img.naturalWidth > 0) {
    const imgX = 160, imgY = 52, imgW = 280, imgH = 200, r = 16
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(imgX + r, imgY)
    ctx.lineTo(imgX + imgW - r, imgY)
    ctx.quadraticCurveTo(imgX + imgW, imgY, imgX + imgW, imgY + r)
    ctx.lineTo(imgX + imgW, imgY + imgH - r)
    ctx.quadraticCurveTo(imgX + imgW, imgY + imgH, imgX + imgW - r, imgY + imgH)
    ctx.lineTo(imgX + r, imgY + imgH)
    ctx.quadraticCurveTo(imgX, imgY + imgH, imgX, imgY + imgH - r)
    ctx.lineTo(imgX, imgY + r)
    ctx.quadraticCurveTo(imgX, imgY, imgX + r, imgY)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, imgX, imgY, imgW, imgH)
    ctx.restore()
  }

  // 区切り線
  ctx.strokeStyle = '#e2b891'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 270)
  ctx.lineTo(560, 270)
  ctx.stroke()

  // 商品名
  ctx.fillStyle = '#2c1f1a'
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(item.name, 300, 308)

  // 価格
  ctx.fillStyle = '#8c5a3b'
  ctx.font = '600 20px system-ui'
  ctx.fillText(`¥${item.price}`, 300, 340)

  // 気分タグをバッジとして描画（左揃え）
  if (moodTags.length > 0) {
    ctx.font = '13px system-ui'
    ctx.textAlign = 'left'
    let tagX = 40
    const tagY = 358
    const tagH = 24
    const padX = 10
    const gap = 8

    moodTags.forEach((tag) => {
      const textW = ctx.measureText(tag).width
      const tagW = textW + padX * 2

      // タグが右端を超えたら次行へ（今回は1行のみ表示）
      if (tagX + tagW > 560) return

      // バッジ背景
      ctx.fillStyle = '#fff3e5'
      ctx.strokeStyle = '#e2b891'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(tagX, tagY, tagW, tagH, 12)
      ctx.fill()
      ctx.stroke()

      // タグテキスト
      ctx.fillStyle = '#5b3520'
      ctx.fillText(tag, tagX + padX, tagY + 16)

      tagX += tagW + gap
    })
    ctx.textAlign = 'center'
  }

  // レコメンド理由ラベル
  ctx.fillStyle = '#8c5a3b'
  ctx.font = '500 13px system-ui'
  ctx.fillText('── レコメンド理由 ──', 300, 404)

  // レコメンド理由テキスト
  ctx.fillStyle = '#4a3122'
  ctx.font = '16px system-ui'
  wrapText(ctx, item.reason, 300, 430, 500, 26)

  // ハッシュタグ
  ctx.fillStyle = '#b07a52'
  ctx.font = '14px system-ui'
  ctx.fillText('#コンビニおすすめ  #今日のおやつ', 300, 630)

  return canvas
}

function RecomendPage({ product, moodTags = [] }) {
  const [copied, setCopied] = useState(false)

  if (!product) {
    return null
  }

  const item = {
    ...product,
    image: productImages[product.image] || custardChouxImage,
    reason: product.reason || product.ai_comment || '今の気分にぴったりの一品です。',
  }

  const handleShare = async () => {
    if (copied) return
    const canvas = await generateShareImage(item, moodTags)

    canvas.toBlob(async (blob) => {
      try {
        // Clipboard APIで画像を1枚だけクリップボードに書き込む
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch (e) {
        // Clipboard API非対応の場合はダウンロード
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'recommendation.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  return (
    <div className="recommend-page">
      <header className="recommend-page__header">
        <p className="recommend-page__eyebrow">おすすめセレクション</p>
        <h1 className="recommend-page__title">今日のレコメンド</h1>
      </header>
      {moodTags.length > 0 && (
        <div className="recommend-page__moods">
          <p className="recommend-page__moods-label">あなたが選んだ気分</p>
          <div className="recommend-page__moods-tags">
            {moodTags.map((tag) => (
              <span key={tag} className="recommend-page__mood-tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
      <section className="recommend-grid">
        <RecomendCard {...item} />
      </section>
      <div className="recommend-page__share-wrap">
        <button
          type="button"
          className="product-card__button product-card__button--share"
          onClick={handleShare}
          disabled={copied}
        >
          {copied ? '✅ コピーしました！' : 'レコメンドをシェア🤝'}
        </button>
      </div>
    </div>
  )
}

export default RecomendPage
