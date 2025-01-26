from fastapi import WebSocket
import json
from app.aws_clients import s3_client, S3_BUCKET_NAME, S3_PROCESSED_PATH


async def process_message(message_json, active_connections):
    if image_id in active_connections:
        websocket: WebSocket = active_connections[image_id]

        try:
            message = json.loads(message_json)
        except json.JSONDecodeError:
            response = {"error": "Invalid json format"}
            await websocket.send_json(response)

        image_id = message.get("image-id")
        status = message.get("status")
        file_type = message.get("file-type")

        if status == "success":
            presigned_url = generate_processed_image_presigned_url(image_id, file_type)
            response = {"presigned_url": presigned_url}
            await websocket.send_json(response)
        elif status == "error":
            error_message = message.get("error_message", "Process message error")
            response = {"error": error_message}
            await websocket.send_json(response)

        # Close WebSocket after sending the response
        await websocket.close()
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
