import json
import re
from back2 import app


def handler(event, context):
    method  = event.get("httpMethod", "GET")
    path    = event.get("path", "/")
    headers = event.get("headers") or {}
    body    = event.get("body") or ""

    if isinstance(body, str):
        try:
            body = json.loads(body)
        except Exception:
            body = {}

    with app.test_client() as client:
        content_type = headers.get("Content-Type", headers.get("content-type", "application/json"))
        response = client.open(
            path,
            method=method,
            json=body if method in ("POST", "PUT", "PATCH") else None,
            content_type=content_type,
        )
        resp_body = response.get_data(as_text=True)
        return {
            "statusCode": response.status_code,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": resp_body,
        }
