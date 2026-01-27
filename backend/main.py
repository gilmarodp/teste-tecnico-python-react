from fastapi import FastAPI
from .routes.auth import auth_router
from .routes.tasks import task_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(task_router)

