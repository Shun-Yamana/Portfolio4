import os
import logging
import datetime

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

ORDER_HISTORY_TABLE_NAME = os.environ.get("TABLE_ORDER_HISTORY", "orderd_history")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))


def add_order_history(user_id: str, username: str, product_id: str):
    """order_history テーブルに履歴を追加する"""
    table = dynamodb.Table(ORDER_HISTORY_TABLE_NAME)
    item = {
        "user_id":    int(user_id),
        "ordered_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S"),
        "username":   username,
        "product_id": product_id,
    }
    try:
        table.put_item(Item=item)
        logger.info(f"order_history added: {item}")
        return item
    except ClientError as e:
        logger.error(f"DynamoDB put_item error: {e}")
        raise
