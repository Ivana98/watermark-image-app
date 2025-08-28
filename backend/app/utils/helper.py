import json
from pathlib import Path
from app.core.aws_clients import (
    s3_client,
    sns_client,
    S3_BUCKET_NAME,
    S3_PROCESSED_PATH,
)
from app.core.state import active_connections


async def process_message(message_json):
    try:
        message = json.loads(message_json)

        object_key = (
            message.get("Records", [{}])[0].get("s3", {}).get("object", {}).get("key")
        )

        if object_key is None:
            # check for error messages from worker service
            if message.get("status") == "failed":
                error_msg = f"{message.get("error", "")} for {message.get("object_key", "unknown object_key")}"
                send_event_message(image_id, error_msg)
                return {"status": "failed", "error": error_msg}
            return {"status": "failed", "error": "Unexpected SNS message body."}

        image_id = Path(object_key).stem
        file_type = Path(object_key).suffix.lstrip(".")

        if image_id in active_connections:
            presigned_url = generate_processed_image_presigned_url(image_id, file_type)
            success_msg = {"status": "success", "presigned_url": presigned_url}

            queue = active_connections.get(image_id)
            await queue.put(success_msg)
            send_event_message(image_id, success_msg)

            return {"status": "success"}
        else:
            return {
                "status": "failed",
                "error": f"Image id {image_id} is not present in active connections.",
            }

    except Exception as e:
        print(f"process_message Exception: {e}")
        error_msg = {
            "status": "failed",
            "error": "Exception while processing the message.",
        }
        send_event_message(image_id, error_msg)
        return error_msg


async def send_event_message(image_id: str, message: object):
    if image_id in active_connections:
        queue = active_connections.get(image_id)
        await queue.put(message)


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
        print(
            f"generate_processed_image_presigned_url Error generating presigned URL: {e}"
        )
        return None


def get_subscription_info(topic_arn, endpoint):
    try:
        paginator = sns_client.get_paginator("list_subscriptions_by_topic")

        for page in paginator.paginate(TopicArn=topic_arn):
            for sub in page["Subscriptions"]:
                if sub["Endpoint"] == endpoint:
                    arn = sub["SubscriptionArn"]

                    attrs = sns_client.get_subscription_attributes(SubscriptionArn=arn)
                    confirmation_status = attrs["Attributes"].get(
                        "PendingConfirmation", "false"
                    )

                    return arn, confirmation_status == "true"
        return None, False
    except Exception as e:
        print(f"get_subscription_info Error generating subscription info: {e}")
        return None, False
