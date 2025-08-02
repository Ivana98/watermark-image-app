from fastapi import APIRouter, Request
from app.core.state import active_connections
import asyncio
import json
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


@router.get("/events/{image_id}")
async def sse(request: Request, image_id: str):
    queue = asyncio.Queue()
    active_connections[image_id] = queue

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await queue.get()
                yield {
                    "event": "message",
                    "data": json.dumps(data),
                }
        except Exception as e:
            print("sse exception: e")
        finally:
            # Clean up after disconnect
            del active_connections[image_id]

    return EventSourceResponse(event_generator())
