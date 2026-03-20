import os
import logging

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

USER_TABLE_NAME = os.environ.get("TABLE_USERS", "user")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))


def get_all_usernames():
    """Users テーブルから全ユーザーの name 一覧を取得する"""
    table = dynamodb.Table(USER_TABLE_NAME)
    try:
        resp = table.scan(ProjectionExpression="#n", ExpressionAttributeNames={"#n": "name"})
        return [item["name"] for item in resp.get("Items", [])]
    except ClientError as e:
        logger.error(f"DynamoDB scan error: {e}")
        return []