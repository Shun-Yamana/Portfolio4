import json
import random
import math
import os
import boto3
from boto3.dynamodb.conditions import Key

VECTOR_MAX = 10
MAX_CYCLES = 3
CANDIDATES_PER_CYCLE = 3

TAGS = [
    "甘い", "苦い", "酸っぱい", "さっぱり", "濃厚",
    "フルーティ", "ミルキー", "香ばしい", "スパイシー", "チョコ",
    "ナッツ", "キャラメル", "クリーミー", "軽い", "重い",
    "温かい", "冷たい", "爽やか", "リッチ", "デザート",
]

TAG_INDEX = {tag: i for i, tag in enumerate(TAGS)}

PRODUCTS = [
    {"id": "choco-cornet",     "name": "チョココロネ",     "price": 138, "category": "パン",     "description": "甘いチョコクリームたっぷりのパン。チョコ好きにはたまらない一品。",       "image": "choco-cornet",     "alt": "チョココロネの写真",         "vector": [8, 0, 0, 0, 5, 0, 4, 3, 0, 8, 0, 2, 5, 2, 5, 3, 0, 0, 5, 8]},
    {"id": "tiramisu",         "name": "ティラミス",       "price": 298, "category": "デザート", "description": "コーヒーとマスカルポーネが溶け合う濃厚スイーツ。",                       "image": "tiramisu",         "alt": "ティラミスの写真",           "vector": [7, 6, 0, 0, 8, 0, 6, 0, 0, 5, 0, 5, 8, 0, 7, 0, 0, 0, 9, 9]},
    {"id": "lemon-tart",       "name": "レモンタルト",     "price": 248, "category": "デザート", "description": "さわやかな酸味とサクサクタルト生地が絶妙。",                           "image": "lemon-tart",       "alt": "レモンタルトの写真",         "vector": [5, 0, 8, 6, 0, 7, 0, 0, 0, 0, 0, 0, 2, 6, 0, 0, 5, 8, 0, 8]},
    {"id": "cheesecake",       "name": "濃厚チーズケーキ", "price": 248, "category": "デザート", "description": "なめらかで濃厚なチーズケーキ。リッチな気分に。",                       "image": "cheesecake",       "alt": "濃厚チーズケーキの写真",     "vector": [6, 0, 2, 0, 9, 0, 7, 0, 0, 0, 0, 0, 9, 0, 6, 0, 0, 0, 9, 9]},
    {"id": "apple-pie",        "name": "アップルパイ",     "price": 228, "category": "デザート", "description": "シナモン香る温かいアップルパイ。ほっこりしたい時に。",                   "image": "apple-pie",        "alt": "アップルパイの写真",         "vector": [7, 0, 3, 0, 5, 5, 0, 6, 0, 0, 0, 6, 0, 0, 5, 8, 0, 0, 5, 8]},
    {"id": "mont-blanc",       "name": "モンブラン",       "price": 298, "category": "デザート", "description": "濃厚な栗クリームとほっくり食感のモンブラン。",                         "image": "mont-blanc",       "alt": "モンブランの写真",           "vector": [7, 0, 0, 0, 8, 0, 6, 4, 0, 0, 6, 0, 7, 0, 6, 0, 0, 0, 8, 9]},
    {"id": "pancake",          "name": "パンケーキ",       "price": 198, "category": "パン",     "description": "ふわふわのパンケーキ。メープルシロップとバターで。",                     "image": "pancake",          "alt": "パンケーキの写真",           "vector": [8, 0, 0, 0, 2, 0, 7, 0, 0, 0, 0, 7, 6, 5, 0, 5, 0, 0, 4, 6]},
    {"id": "donut",            "name": "ドーナツ",         "price": 148, "category": "スナック", "description": "もちもちのドーナツ。小腹が空いた時にちょうどいい。",                   "image": "donut",            "alt": "ドーナツの写真",             "vector": [8, 0, 0, 0, 5, 0, 5, 2, 0, 2, 0, 0, 3, 5, 3, 3, 0, 0, 4, 7]},
    {"id": "brownie",          "name": "ブラウニー",       "price": 178, "category": "デザート", "description": "濃厚なチョコとナッツが絡み合うブラウニー。",                           "image": "brownie",          "alt": "ブラウニーの写真",           "vector": [7, 4, 0, 0, 8, 0, 0, 0, 0, 9, 6, 0, 3, 0, 7, 0, 0, 0, 8, 9]},
    {"id": "macaron",          "name": "マカロン",         "price": 178, "category": "デザート", "description": "カラフルでかわいいマカロン。フルーティな味も揃う。",                   "image": "macaron",          "alt": "マカロンの写真",             "vector": [8, 0, 0, 0, 2, 6, 5, 0, 0, 0, 0, 0, 6, 6, 0, 0, 4, 5, 3, 9]},
    {"id": "choux-cream",      "name": "シュークリーム",   "price": 138, "category": "デザート", "description": "サクサク生地にたっぷりカスタード。定番の甘さ。",                       "image": "choux-cream",      "alt": "シュークリームの写真",       "vector": [7, 0, 0, 0, 3, 0, 8, 0, 0, 0, 0, 0, 8, 6, 0, 0, 4, 0, 3, 8]},
    {"id": "vanilla-ice",      "name": "バニラアイス",     "price": 148, "category": "アイス",   "description": "なめらかなバニラアイス。冷たくて爽やか。",                             "image": "vanilla-ice",      "alt": "バニラアイスの写真",         "vector": [6, 0, 0, 5, 0, 0, 8, 0, 0, 0, 0, 0, 8, 7, 0, 0, 9, 5, 2, 7]},
    {"id": "choco-ice",        "name": "チョコアイス",     "price": 148, "category": "アイス",   "description": "濃いチョコレートのアイス。冷たいのにリッチな味わい。",                 "image": "choco-ice",        "alt": "チョコアイスの写真",         "vector": [7, 2, 0, 2, 5, 0, 5, 0, 0, 9, 0, 0, 6, 5, 0, 0, 9, 0, 7, 8]},
    {"id": "strawberry-short", "name": "いちごショート",   "price": 298, "category": "デザート", "description": "ふわふわスポンジと生クリーム、甘酸っぱいいちご。",                     "image": "strawberry-short", "alt": "いちごショートケーキの写真", "vector": [7, 0, 4, 3, 0, 7, 6, 0, 0, 0, 0, 0, 6, 5, 0, 0, 4, 6, 2, 9]},
    {"id": "fruit-tart",       "name": "フルーツタルト",   "price": 348, "category": "デザート", "description": "季節のフルーツが盛りだくさん。爽やかで見た目も華やか。",                 "image": "fruit-tart",       "alt": "フルーツタルトの写真",       "vector": [5, 0, 5, 6, 0, 9, 0, 0, 0, 0, 0, 0, 3, 6, 0, 0, 5, 9, 0, 9]},
]

ALL_CATEGORIES = list({p["category"] for p in PRODUCTS})

dynamodb        = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))
TABLE_INVENTORY = os.environ.get("TABLE_INVENTORY", "Inventory")
TABLE_PRODUCTS  = os.environ.get("TABLE_PRODUCTS",  "Products")
TABLE_STORES    = os.environ.get("TABLE_STORES",    "Store")
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")


def dot_product(vec_a, vec_b):
    return sum(a * b for a, b in zip(vec_a, vec_b))

def build_user_vector(selected_tags):
    vec = [0] * len(TAGS)
    for tag in selected_tags:
        if tag in TAG_INDEX:
            vec[TAG_INDEX[tag]] += 5
    return vec

def update_user_vector(user_vector, product_vector):
    return [u + p for u, p in zip(user_vector, product_vector)]

def get_in_stock_products(store_id=1):
    try:
        inv_table    = dynamodb.Table(TABLE_INVENTORY)
        resp         = inv_table.query(KeyConditionExpression=Key("store_id").eq(store_id))
        in_stock_ids = {item["product_id"] for item in resp["Items"] if int(item.get("stock", 0)) > 0}
        prod_table   = dynamodb.Table(TABLE_PRODUCTS)
        products     = []
        for pid in in_stock_ids:
            r = prod_table.get_item(Key={"product_id": pid})
            if "Item" in r:
                item = r["Item"]
                item["vector"] = list(item.get("vector", []))
                products.append(item)
        return products if products else PRODUCTS
    except Exception:
        return PRODUCTS

def recommend(user_vector, products, exclude_ids=None, n=CANDIDATES_PER_CYCLE, temperature=2.0, mh_steps=100):
    exclude_ids = exclude_ids or []
    candidates  = [p for p in products if p["id"] not in exclude_ids]
    if not candidates:
        return []

    def get_score(product):
        return dot_product(user_vector, product["vector"])

    current = random.choice(candidates)
    samples = []
    for _ in range(mh_steps):
        proposal       = random.choice(candidates)
        p_current      = math.exp(get_score(current)  / temperature)
        p_proposal     = math.exp(get_score(proposal) / temperature)
        acceptance_ratio = min(1, p_proposal / p_current)
        if random.random() < acceptance_ratio:
            current = proposal
        samples.append(current)

    unique   = []
    seen_ids = set()
    for s in reversed(samples):
        if s["id"] not in seen_ids:
            unique.append(s)
            seen_ids.add(s["id"])
        if len(unique) == n:
            break

    if len(unique) < n:
        for p in candidates:
            if p["id"] not in seen_ids:
                unique.append(p)
                seen_ids.add(p["id"])
            if len(unique) == n:
                break

    random.shuffle(unique)
    return unique

def product_to_json(product):
    return {
        "id":          product["id"],
        "name":        product["name"],
        "price":       product["price"],
        "description": product["description"],
        "image":       product["image"],
        "alt":         product["alt"],
    }

def generate_ai_comment(user_vector, chosen_product):
    tag_scores = [(TAGS[i], user_vector[i]) for i in range(len(TAGS)) if user_vector[i] > 0]
    tag_scores.sort(key=lambda x: x[1], reverse=True)
    top_tags = [t for t, _ in tag_scores[:3]] or ["おいしい"]
    prompt = (
        f"ユーザーは「{'」、「'.join(top_tags)}」に当てはまる商品を望んでいます。\n"
        f"おすすめ商品は「{chosen_product['name']}」です（{chosen_product['description']}）。\n"
        "これを踏まえて、レコメンド理由を一文で考えてください。"
    )
    try:
        bedrock = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))
        body    = json.dumps({"anthropic_version": "bedrock-2023-05-31", "max_tokens": 200, "messages": [{"role": "user", "content": prompt}]})
        resp    = bedrock.invoke_model(modelId=BEDROCK_MODEL_ID, body=body)
        return json.loads(resp["body"].read())["content"][0]["text"].strip()
    except Exception:
        return f"「{', '.join(top_tags)}」な気分にぴったりの一品です！"


def handler(event, context):
    path   = event.get("path", "/")
    method = event.get("httpMethod", "POST")
    body   = json.loads(event.get("body") or "{}")
    if method == "POST" and path == "/mood":
        return handle_mood(body)
    elif method == "POST" and path == "/select":
        return handle_select(body)
    elif method == "POST" and path == "/final":
        return handle_final(body)
    else:
        return response(404, {"error": f"Not found: {method} {path}"})

def handle_mood(body):
    mood_tags   = body.get("mood_tags", [])
    store_id    = body.get("store_id", 1)
    user_vector = build_user_vector(mood_tags)
    products    = get_in_stock_products(store_id)
    candidates  = recommend(user_vector, products)
    return response(200, {
        "user_vector":     user_vector,
        "cycle":           1,
        "max_cycles":      MAX_CYCLES,
        "candidates":      [product_to_json(p) for p in candidates],
        "no_match_option": True,
    })

def handle_select(body):
    user_vector      = body.get("user_vector", [0] * len(TAGS))
    cycle            = body.get("cycle", 1)
    selected_product = body.get("selected_product")
    selected_ids     = body.get("selected_ids", [])
    no_match         = body.get("no_match", False)
    store_id         = body.get("store_id", 1)
    products         = get_in_stock_products(store_id)
    if not no_match and selected_product:
        matched = next((p for p in products if p["id"] == selected_product["id"]), None)
        if matched:
            user_vector = update_user_vector(user_vector, matched["vector"])
        selected_ids = selected_ids + [selected_product["id"]]
    next_cycle = cycle + 1
    is_final   = next_cycle >= MAX_CYCLES
    candidates = recommend(user_vector, products, exclude_ids=selected_ids)
    return response(200, {
        "user_vector":     user_vector,
        "cycle":           next_cycle,
        "max_cycles":      MAX_CYCLES,
        "candidates":      [product_to_json(p) for p in candidates],
        "no_match_option": not is_final,
        "is_final":        is_final,
    })

def handle_final(body):
    user_vector      = body.get("user_vector", [0] * len(TAGS))
    selected_product = body.get("selected_product")
    store_id         = body.get("store_id", 1)
    if not selected_product:
        products         = get_in_stock_products(store_id)
        top              = recommend(user_vector, products, n=1)
        selected_product = product_to_json(top[0]) if top else {}
    ai_comment = generate_ai_comment(user_vector, selected_product)
    return response(200, {"recommendation": selected_product, "ai_comment": ai_comment})

def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body, ensure_ascii=False),
    }

if __name__ == "__main__":
    r1 = handle_mood({"mood_tags": ["甘い", "チョコ", "濃厚"]})
    d1 = json.loads(r1["body"])
    print(json.dumps(d1, ensure_ascii=False, indent=2))
    r2 = handle_select({"user_vector": d1["user_vector"], "cycle": d1["cycle"], "selected_product": d1["candidates"][0], "selected_ids": [d1["candidates"][0]["id"]], "no_match": False})
    d2 = json.loads(r2["body"])
    print(json.dumps(d2, ensure_ascii=False, indent=2))
    r3 = handle_final({"user_vector": d2["user_vector"], "selected_product": d2["candidates"][0]})
    d3 = json.loads(r3["body"])
    print(json.dumps(d3, ensure_ascii=False, indent=2))
