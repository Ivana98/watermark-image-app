from fastapi import APIRouter, Request, HTTPException
import json
from app.aws_clients import sns_client
from app.utils.helper import process_message
from app.state import active_connections

router = APIRouter()


@router.post("/sns-notification")
async def sns_notification(request: Request):
    # Parse the incoming notification
    print("sns-notification")
    raw_body = await request.body()
    try:
        body = json.loads(raw_body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    # Handle SNS Subscription Confirmation
    if body.get("Type") == "SubscriptionConfirmation":
        subscribe_url = body["SubscribeURL"]
        print(f"Confirming subscription at {subscribe_url}")
        sns_client.confirm_subscription(TopicArn=body["TopicArn"], Token=body["Token"])
        return {"message": "Subscription confirmed"}

    # Handle SNS Notification
    if body.get("Type") == "Notification":
        response = await process_message(body["Message"], active_connections)
        if response.get("status") == "failed":
            raise HTTPException(status_code=400, detail=f"{response.get("error", "")}")
            
    return {"message": "Notification processed"}
