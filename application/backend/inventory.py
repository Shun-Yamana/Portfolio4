import os
import logging

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

INVENTORY_TABLE_NAME = os.environ.get("TABLE_INVENTORY_PROD", "inventory_prod")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))


def increment_inventory(product_id: str, amount: int = 1):
    """指定商品の在庫を amount 分増やす"""
    if not product_id:
        raise ValueError("product_id is required")
    if amount <= 0:
        raise ValueError("amount must be positive")

    table = dynamodb.Table(INVENTORY_TABLE_NAME)
    try:
        resp = table.update_item(
            Key={"id": product_id},
            UpdateExpression="SET inventry = inventry + :amt",
            ExpressionAttributeValues={":amt": amount},
            ReturnValues="UPDATED_NEW",
        )
        updated = int(resp["Attributes"]["inventry"])
        logger.info(f"inventory updated: {product_id} -> {updated}")
        return {"product_id": product_id, "inventry": updated}
    except ClientError as e:
        logger.error(f"DynamoDB update_item error for product_id={product_id}: {e}")
        raise