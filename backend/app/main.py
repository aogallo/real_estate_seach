from core.config import settings
from fastapi import FastAPI
from routers.chat import chat_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": f"Hello World Testing Reload {settings.database_url}"}


prefix = "/api"

app.include_router(router=chat_router, prefix=prefix)
