from fastapi import APIRouter, HTTPException, Request, Response
from botocore.exceptions import ClientError
from app.aws_clients import s3_client, S3_BUCKET_NAME, S3_PROCESSED_PATH

router = APIRouter()


@router.get("/download-image/{image_name}")
async def download_image(request: Request, image_name: str):
    try:
        key = f"{S3_PROCESSED_PATH}/{image_name}"
        
        s3_object = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=key)
        content = s3_object["Body"].read()
        content_type = s3_object["ContentType"]

        return Response(
            content=content,
            media_type=content_type,
            headers={
                "Content-Disposition": f'attachment; filename="{image_name}"'
            },
        )
    except ClientError as e:
        print(f"download_image Error while trying to download processed image: {e}")
        raise HTTPException(status_code=404, detail="File not found")
