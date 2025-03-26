from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.controllers import uploadImageController
from app.controllers import snsController
from app.controllers import eventController
from app.controllers import downloadImageController
from app.utils.helper import get_subscription_arn_for_endpoint
from app.aws_clients import sns_client, SNS_TOPIC_ARN, DOMAIN, FRONTEND_URL


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run when the server is starting up
    asyncio.create_task(sns_subscription_task())
    yield  # This is where the app will start receiving traffic
    # Code to run on server shutdown


app = FastAPI(lifespan=lifespan, root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=set([FRONTEND_URL, DOMAIN]),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(snsController.router)
app.include_router(uploadImageController.router)
app.include_router(eventController.router)
app.include_router(downloadImageController.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


async def sns_subscription_task():
    app.state.subscriptionArn = get_subscription_arn_for_endpoint(
        SNS_TOPIC_ARN, f"{DOMAIN}/api/sns-notification"
    )

    if app.state.subscriptionArn == None:
        app.state.subscriptionArn = sns_client.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol="https",
            Endpoint=f"{DOMAIN}/api/sns-notification",
            ReturnSubscriptionArn=True,
        )["SubscriptionArn"]
