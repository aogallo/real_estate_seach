from contextlib import asynccontextmanager
from sqlalchemy import text
from core.config import settings
from core.database import engine
from fastapi import FastAPI
from routers.chat import chat_router

@asynccontextmanager
asycn def lifespan(app: FastAPI):
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("Database connected successfully")

app = FastAPI(lifespan=lifespan)




@app.get("/")
async def root():
    return {"message": f"Hello World Testing Reload {settings.database_url}"}


prefix = "/api"

app.include_router(router=chat_router, prefix=prefix)
