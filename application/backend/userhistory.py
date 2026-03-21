import os
import logging
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

ORDER_HISTORY_TABLE_NAME = os.environ.get("TABLE_ORDER_HISTORY", "orderd_history")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))

def get_order_history_by_user_id(user_id: str):
    """user_id に紐づく注文履歴を取得する"""
    table = dynamodb.Table(ORDER_HISTORY_TABLE_NAME)
    try:
        # user_idが数値(1)か文字列("user1")かを判定してDynamoDBに合わせる
        try:
            parsed_user_id = int(user_id)
        except ValueError:
            parsed_user_id = user_id
            
        resp = table.query(KeyConditionExpression=Key("user_id").eq(parsed_user_id))
        return resp.get("Items", [])
    except (ClientError, NoCredentialsError) as e:
        logger.error(f"DynamoDB query error for user_id={user_id}: {e}")
        return None  # エラー時はNoneを返してバックエンド側でモックに切り替える


def get_all_order_history_sorted():
    """全履歴を user_id 順に取得する"""
    table = dynamodb.Table(ORDER_HISTORY_TABLE_NAME)
    try:
        resp = table.scan()
        items = resp.get("Items", [])
        # user_idが数値か文字列か混ざっていてもソートできるようにする
        return sorted(items, key=lambda x: int(x["user_id"]) if str(x["user_id"]).isdigit() else str(x["user_id"]))
    except (ClientError, NoCredentialsError) as e:
        logger.error(f"DynamoDB scan error: {e}")
        return []