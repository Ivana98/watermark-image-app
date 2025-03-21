from fastapi import WebSocket
import json
from pathlib import Path
from app.aws_clients import s3_client, S3_BUCKET_NAME, S3_PROCESSED_PATH
from starlette.websockets import WebSocketState
from starlette.websockets import WebSocketDisconnect


async def process_message(message_json, active_connections):
    try:
        message = json.loads(message_json)
    
        if message.get("Records") is None:
            if message.get("status") == 'failed':
                error_msg = f"{message.get("error", "")} for {message.get("object_key", "unknown object_key")}"
                print(f"error: {error_msg}")
                return { "status": 'failed', "error": error_msg}
            return { "status": 'failed', "error": "Unexpected SNS message body."}
            
        object_key = (
            message.get("Records", [{}])[0]
            .get("s3", {})
            .get("object", {})
            .get("key")
        )
        image_id = Path(object_key).stem
        file_type = Path(object_key).suffix

        print("processing message")

        if image_id in active_connections:
            websocket: WebSocket = active_connections[image_id]

            print(f"image_id: {image_id}")
            print(f"active_connections: {active_connections}")

            presigned_url = generate_processed_image_presigned_url(image_id, file_type)
            response = {"presigned_url": presigned_url}

            print(f"WebSocket State before sending: {websocket.client_state}")
            if not isinstance(websocket, WebSocket):
                return { "status": 'failed', "error": f"Invalid WebSocket instance for {image_id}: {type(websocket)}"}

            await websocket.send_json(response)
            return { "status": 'success' }
        else:
            { "status": 'failed', "error": f"Image id {image_id} is not present in active connections."}

    except Exception as e:
        print(f"Exception {e}")
        return { "status": 'failed', "error": "Exception while processing the message."}
    finally:
        active_connections.pop(image_id, None)


def generate_processed_image_presigned_url(image_id, file_type):
    try:
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": f"{S3_PROCESSED_PATH}/{image_id}.{file_type}",
            },
            ExpiresIn=3600,
        )
        return presigned_url
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None
