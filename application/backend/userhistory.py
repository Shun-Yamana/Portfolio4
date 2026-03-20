import os
import logging

import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

ORDER_HISTORY_TABLE_NAME = os.environ.get("TABLE_ORDER_HISTORY", "order_history")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))


def get_order_history_by_user_id(user_id: str):
    """user_id に紐づく注文履歴を取得する"""
    table = dynamodb.Table(ORDER_HISTORY_TABLE_NAME)
    try:
        resp = table.query(KeyConditionExpression=Key("user_id").eq(user_id))
        return resp.get("Items", [])
    except ClientError as e:
        logger.error(f"DynamoDB query error for user_id={user_id}: {e}")
        return []