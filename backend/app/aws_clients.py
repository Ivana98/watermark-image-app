from dotenv import load_dotenv
import os
import boto3

load_dotenv(override=False)

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
S3_UPLOADS_PATH=os.getenv("S3_UPLOADS_PATH")
S3_PROCESSED_PATH=os.getenv("S3_PROCESSED_PATH")

SNS_TOPIC_ARN = os.getenv("SNS_TOPIC_ARN")

sns_client = boto3.client("sns")
s3_client = boto3.client("s3")

DOMAIN = os.getenv("DOMAIN")
