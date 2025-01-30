from fastapi import FastAPI
from app.controllers import uploadImageController
from app.controllers import snsController
from app.controllers import websocketController
from contextlib import asynccontextmanager
from app.aws_clients import sns_client, SNS_TOPIC_ARN, DOMAIN, FRONTEND_URL
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run when the server is starting up
    # response = sns_client.subscribe(
    #     TopicArn=SNS_TOPIC_ARN,
    #     Protocol='https',
    #     Endpoint=f'https://{DOMAIN}/sns-notification',
    #     ReturnSubscriptionArn=True
    # )
    print("Startup tasks complete! Server is ready to receive traffic.")
    yield  # This is where the app will start receiving traffic
    # sns_client.unsubscribe(SubscriptionArn=response['SubscriptionArn'])

app = FastAPI(lifespan=lifespan)

app.include_router(uploadImageController.router)
app.include_router(snsController.router)
app.include_router(websocketController.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Allow only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
