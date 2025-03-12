from fastapi import WebSocket
import json
from pathlib import Path
from app.aws_clients import s3_client, S3_BUCKET_NAME, S3_PROCESSED_PATH
from starlette.websockets import WebSocketState
from starlette.websockets import WebSocketDisconnect


async def process_message(message_json, active_connections):
    try:
        message = json.loads(message_json)
    except json.JSONDecodeError:
        response = {"error": "Invalid json format"}
        # await websocket.send_json(response)
        return

    object_key = message["Records"][0]["s3"]["object"]["key"]
    image_id = Path(object_key).stem
    file_type = Path(object_key).suffix

    # image_id = message.get("image-id")
    print("processing message")
    print(f"object_key: {object_key}")

    if image_id in active_connections:
        websocket: WebSocket = active_connections[image_id]

        print(f"image_id: {image_id}")
        print(f"active_connections: {active_connections}")

        try:
            presigned_url = generate_processed_image_presigned_url(image_id, file_type)
            response = {"presigned_url": presigned_url}

            # print(f"presigned_url: {presigned_url}")
            print(f"WebSocket State before sending: {websocket.client_state}")
            if not isinstance(websocket, WebSocket):
                print(f"Invalid WebSocket instance for {image_id}: {type(websocket)}")
                return

            await websocket.send_json(response)
            # elif status == "error":
            #     error_message = message.get("error_message", "Process message error")
            #     response = {"error": error_message}
            #     await websocket.send_json(response)

        except Exception as e:
            print(f"Exception {e}")
        finally:
            # if websocket.client_state == WebSocketState.CONNECTED:
            #     await websocket.close()
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
