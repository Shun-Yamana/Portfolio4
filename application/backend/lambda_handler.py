import json
import re
from back2 import app


def handler(event, context):
import json
import re
import traceback

try:
    from back2 import app
except Exception as e:
    # Log import error
    import logging
    logger = logging.getLogger()
    logger.setLevel(logging.ERROR)
    logger.error(f"Failed to import back2: {str(e)}")
    logger.error(traceback.format_exc())
    app = None


import logging
logger = logging.getLogger()
logger.setLevel(logging.ERROR)


def handler(event, context):
    try:
        if app is None:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Backend module failed to load"}),
            }
        
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
    except Exception as e:
        logger.error(f"Handler exception: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e), "type": type(e).__name__}),
        }
