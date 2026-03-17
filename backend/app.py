import random

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {
        "id": "crispy-chicken",
        "name": "サクサククリスピーチキン",
        "price": 198,
        "description": "外カリ中ジューシー。",
        "image": "crispy-chicken",
        "alt": "サクサククリスピーチキンの写真",
    },
    {
        "id": "cheese-hash",
        "name": "とろけるチーズハッシュポテト",
        "price": 158,
        "description": "割るとチーズがとろ〜り。",
        "image": "cheese-hash",
        "alt": "とろけるチーズハッシュポテトの写真",
    },
    {
        "id": "custard-choux",
        "name": "とろけるカスタードシュー",
        "price": 158,
        "description": "割った瞬間、クリームがあふれる。",
        "image": "custard-choux",
        "alt": "とろけるカスタードシューの写真",
    },
    {
        "id": "spicy-nuggets",
        "name": "スパイシーナゲット",
        "price": 228,
        "description": "ピリ辛でクセになる。",
        "image": "crispy-chicken",
        "alt": "スパイシーナゲットの写真",
    },
    {
        "id": "maple-donut",
        "name": "メープルドーナツ",
        "price": 178,
        "description": "甘い香りがふわっと広がる。",
        "image": "custard-choux",
        "alt": "メープルドーナツの写真",
    },
]

PRODUCT_REASONS = {
    "crispy-chicken": "スパイスの香りが食欲を刺激して、軽い食事にぴったり。",
    "cheese-hash": "ホクホクとろける食感で、満足感が高いおすすめ。",
    "custard-choux": "甘さ控えめのクリームで食後のデザートに最適。",
    "spicy-nuggets": "ピリ辛の刺激が欲しいときにちょうどいい。",
    "maple-donut": "甘い香りで気分転換したいときにおすすめ。",
}


class ProductSelection(BaseModel):
    id: str
    name: str
    price: int
    description: str
    image: str
    alt: str


def _get_product_by_id(product_id: str):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def _next_three_products(selected_id: str):
    k = min(3, len(PRODUCTS))
    selected_product = _get_product_by_id(selected_id)
    if not selected_product:
        return random.sample(PRODUCTS, k=k)

    remaining = [product for product in PRODUCTS if product["id"] != selected_id]
    rest_k = max(0, k - 1)
    rest = random.sample(remaining, k=min(rest_k, len(remaining)))
    return [selected_product, *rest]


@app.get("/products")
def get_products():
    return random.sample(PRODUCTS, k=3)


@app.post("/products/selection")
def post_selection(selection: ProductSelection):
    return _next_three_products(selection.id)


@app.post("/products/recommend")
def post_recommend(selection: ProductSelection):
    selected = selection.model_dump()
    selected["reason"] = PRODUCT_REASONS.get(
        selection.id, "今の気分にぴったりの一品です。"
    )
    return selected
