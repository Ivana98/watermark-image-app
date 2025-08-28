from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.controllers import uploadImageController
from app.controllers import snsController
from app.controllers import eventController
from app.controllers import downloadImageController
from app.controllers import healthController
from app.utils.helper import get_subscription_info
from app.core.aws_clients import sns_client, SNS_TOPIC_ARN, DOMAIN, FRONTEND_URL


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
app.include_router(healthController.router)


async def sns_subscription_task():
    subscription_arn, confirmation_status = get_subscription_info(
        SNS_TOPIC_ARN, f"{DOMAIN}/api/sns-notification"
    )

    if subscription_arn and confirmation_status == True:
        app.state.subscriptionArn = subscription_arn
    else:
        # Unsubscribe if pending or broken
        if subscription_arn and confirmation_status != True:
            print(f"Unsubscribing from sns topic; subscription arn: {subscription_arn}")
            sns_client.unsubscribe(SubscriptionArn=subscription_arn)

        print("Subscribing for sns topic")
        app.state.subscriptionArn = sns_client.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol="https",
            Endpoint=f"{DOMAIN}/api/sns-notification",
            ReturnSubscriptionArn=True,
        )["SubscriptionArn"]
