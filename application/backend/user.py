import os
import logging

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

USER_TABLE_NAME = os.environ.get("TABLE_USERS", "user")

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-northeast-1"))


def get_all_users():
    """Users テーブルから全ユーザーの id と name 一覧を取得する"""
    table = dynamodb.Table(USER_TABLE_NAME)
    try:
        # scanメソッドでテーブルの全件を取得
        resp = table.scan()
        users = []
        for item in resp.get("Items", []):
            # フロントエンドの要件に合わせて、id と name の辞書を作成
            # (DynamoDBの主キーが user_id の場合も考慮して .get() でフォールバック)
            user_id = item.get("id") or item.get("user_id")
            users.append({
                "id": user_id,
                "name": item.get("name")
            })
        return users
    except ClientError as e:
        logger.error(f"DynamoDB scan error: {e}")
        return []