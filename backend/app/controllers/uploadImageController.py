from fastapi import APIRouter, HTTPException
from botocore.exceptions import ClientError
import uuid
from app.aws_clients import s3_client, S3_BUCKET_NAME, S3_UPLOADS_PATH
from app.models.uploadRequest import UploadRequest

router = APIRouter()

# Constraints
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]


@router.post("/upload-image")
async def upload_image(request: UploadRequest):
    file_type = request.file_type
    watermark_text = request.watermark_text
    
    if file_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed.")

    # Generate a UUID for the object key
    unique_id = str(uuid.uuid4())
    file_extension = file_type.split("/")[-1]
    object_key = f"{S3_UPLOADS_PATH}/{unique_id}.{file_extension}"

    print(f"S3_BUCKET_NAME: {S3_BUCKET_NAME}")
    try:
        response = s3_client.generate_presigned_post(
            Bucket=S3_BUCKET_NAME,
            Key=object_key,
            Fields={
                "Content-Type": file_type,
                "x-amz-meta-watermark-text": watermark_text,
            },
            Conditions=[
                {"Content-Type": file_type},
                {"x-amz-meta-watermark-text": watermark_text},  # Ensure metadata is required
                ["content-length-range", 0, MAX_FILE_SIZE],
            ],
            ExpiresIn=3600,  # URL expires in 1 hour
        )
        return {
            "url": response["url"],
            "fields": response["fields"],
            "image_id": unique_id,
        }
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))
