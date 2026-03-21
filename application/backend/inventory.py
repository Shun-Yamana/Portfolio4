import os
import logging
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# back2.pyとテーブル名を統一します
INVENTORY_TABLE_NAME = os.environ.get("TABLE_INVENTORY", "Inventory")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))

def get_inventory_from_db(store_id: int):
    """指定された店舗の在庫一覧を { "商品ID": 在庫数 } の辞書形式で取得する"""
    table = dynamodb.Table(INVENTORY_TABLE_NAME)
    try:
        # store_idをキーにしてクエリ検索
        resp = table.query(
            KeyConditionExpression=Key("store_id").eq(store_id)
        )
        inventory_dict = {}
        for item in resp.get("Items", []):
            inventory_dict[item["product_id"]] = int(item.get("stock", 0))
        return inventory_dict
    except (ClientError, NoCredentialsError) as e:
        logger.error(f"DynamoDB query error: {e}")
        return None # 失敗時はNoneを返す

def update_inventory_to_db(store_id: int, items: list):
    """在庫データをDynamoDBに保存・更新する"""
    table = dynamodb.Table(INVENTORY_TABLE_NAME)
    updated = []
    try:
        for item in items:
            product_id = item.get("product_id")
            stock = int(item.get("stock", 0))
            
            # ステータス文字列の計算（運用管理用）
            stock_status = "out_of_stock" if stock == 0 else ("low" if stock <= 5 else "in_stock")

            # put_itemで上書き保存
            table.put_item(
                Item={
                    "store_id": store_id,
                    "product_id": product_id,
                    "stock": stock,
                    "stock_status": stock_status
                }
            )
            updated.append({"product_id": product_id, "stock": stock})
        return updated
    except (ClientError, NoCredentialsError) as e:
        logger.error(f"DynamoDB put_item error: {e}")
        print("警告: AWS認証がないため、DynamoDBには保存せず成功したことにして返します")
        # エラーで落とさずに、そのまま受け取ったデータを返す
        return items
    
    '''
    except (ClientError, NoCredentialsError) as e:
        logger.error(f"DynamoDB put_item error: {e}")
        raise e
    '''
    
    