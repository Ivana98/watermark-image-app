import boto3
import json
import time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import os
from dotenv import load_dotenv

load_dotenv(override=False)

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
S3_UPLOADS_PATH = os.getenv("S3_UPLOADS_PATH")
S3_PROCESSED_PATH = os.getenv("S3_PROCESSED_PATH")

SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")

SNS_TOPIC_ARN = os.getenv("SNS_TOPIC_ARN")

sqs_client = boto3.client("sqs")
s3_client = boto3.client("s3")
sns_client = boto3.client("sns")


def send_failure_notification(object_key, error_message):
    try:
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=json.dumps(
                {"status": "failed", "object_key": object_key, "error": error_message}
            ),
            Subject="Image Processing Failed",
        )
        print(f"Failure notification sent to SNS for {object_key}: {error_message}")
    except Exception as e:
        print(f"Error sending SNS failure notification: {e}")


def add_watermark(image, watermarkText):
    try: 
        MARGIN = 24

        font_path = Path("fonts/Inter_28pt-ExtraBold.ttf")
        font = ImageFont.truetype(str(font_path), 28)

        draw = ImageDraw.Draw(image)
        bbox = draw.textbbox((0, 0), watermarkText, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = image.width - text_width - MARGIN
        y = image.height - text_height - MARGIN

        draw.text((x - 1, y - 1), watermarkText, font=font, fill="black")
        draw.text((x + 1, y + 1), watermarkText, font=font, fill="black")
        draw.text((x, y), watermarkText, font=font, fill="white")

        return image
    except:
        raise Exception("Error while adding watermark to image")
    
def save_image_to_s3(watermarked_img, object_key, img_format, bucket_name, s3_object):
    new_File_name = f"{Path(object_key).stem}{Path(object_key).suffix}"
    new_s3_key = f"{S3_PROCESSED_PATH}/{new_File_name}"

    # Save the watermarked image back to S3
    buffer = BytesIO()
    watermarked_img.save(buffer, format=img_format)
    buffer.seek(0)

    s3_client.put_object(
        Bucket=bucket_name,
        Key=new_s3_key,
        Body=buffer,
        ContentType=s3_object["ContentType"],
    )
    print(
        f"Watermarked image saved as '{new_s3_key}' in bucket '{bucket_name}'"
    )


def process_s3_image(bucket_name, object_key):
    try:
        # Fetch object metadata
        head_response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
        watermark_text = head_response.get("Metadata", {}).get("watermark-text", "Watermarky")

        # Download the image from S3
        s3_object = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        image_data = s3_object["Body"].read()

        with Image.open(BytesIO(image_data)) as img:
            watermarked_img = add_watermark(img.copy(), watermark_text)
            save_image_to_s3(watermarked_img, object_key, img.format, bucket_name, s3_object)

    except Exception as e:
        print(f"Error processing image {object_key}: {e}")
        send_failure_notification(object_key, f"Image Processing Error: {e}")
        
        
def process_sqs_message(message):
    try:
        body = json.loads(message["Body"])
        records = body.get("Records", [])

        if body.get("Event") == "s3:TestEvent":
            sqs_client.delete_message(
                QueueUrl=SQS_QUEUE_URL,
                ReceiptHandle=message["ReceiptHandle"],
            )
            return

        if not records:
            raise ValueError("No Records found in SQS message")

        for record in records:
            bucket_name = (
                record.get("s3", {})
                .get("bucket", {})
                .get("name")
            )
            object_key = (
                record.get("s3", {})
                .get("object", {})
                .get("key")
            )
            
            if bucket_name != None and object_key != None:
                print(
                    f"Processing image from bucket: {bucket_name}, key: {object_key}"
                )
                process_s3_image(bucket_name, object_key)

        sqs_client.delete_message(
            QueueUrl=SQS_QUEUE_URL,
            ReceiptHandle=message["ReceiptHandle"],
        )
        print(f"Message deleted from SQS: {message['MessageId']}")

    except Exception as processing_error:
        print(f"Error processing SQS message: {processing_error}")


def poll_sqs():
    while True:
        try:
            response = sqs_client.receive_message(
                QueueUrl=SQS_QUEUE_URL,
                MaxNumberOfMessages=5,
                WaitTimeSeconds=20,  # Long pooling - wait up to 20s for new messages before returning
            )

            if "Messages" in response:
                for message in response["Messages"]:
                    process_sqs_message(message)   
            # Else: No messages received. Polling again...

        except Exception as sqs_error:
            print(f"Error polling SQS: {sqs_error}")
            time.sleep(30)  # Wait before retrying


if __name__ == "__main__":
    print("Starting SQS listener...")
    poll_sqs()
