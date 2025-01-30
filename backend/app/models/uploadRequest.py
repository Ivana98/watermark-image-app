from pydantic import BaseModel

class UploadRequest(BaseModel):
    file_type: str
    watermark_text: str