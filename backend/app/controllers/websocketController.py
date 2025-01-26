from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from app.state import active_connections

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, image_id: str = Query(...)):
    if not image_id:
        raise HTTPException(status_code=400, detail="Image ID is required")

    try:
        await websocket.accept()
        active_connections[image_id] = websocket
        print(f"Connection opened for image_id: {image_id}")
    except WebSocketDisconnect:
        print(f"Connection closed for image_id: {image_id}")
        active_connections.pop(image_id, None)
