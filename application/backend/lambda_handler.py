import json
import re
import traceback
import logging

# Set up logging at module level
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Try to import Flask app
try:
    from back2 import app
except Exception as e:
    logger.error(f"Failed to import back2: {str(e)}", exc_info=True)
    app = None


def handler(event, context):
    """AWS Lambda handler for Portfolio4 API"""
    try:
        if app is None:
            logger.error("Flask app not available")
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Backend module failed to load"}),
            }
        
        method = event.get("httpMethod", "GET")
        path = event.get("path", "/")
        headers = event.get("headers") or {}
        body = event.get("body") or ""
        
        # Parse JSON body if it's a string
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception:
                body = {}
        
        # Route through Flask test client
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
        logger.error(f"Lambda handler exception: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Internal server error", "details": str(e)}),
        }
