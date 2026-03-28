from contextlib import asynccontextmanager
from app.core.config import settings
from sqlalchemy import text
from app.core.database import engine
from fastapi import FastAPI
from app.routers.chat import chat_router
from sqlalchemy.exc import OperationalError


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("Database connected successfully")
    except OperationalError as e:
        print(f"Database connection failed: {e}")
        raise

    yield

    print("Application shutting down")


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": f"Hello World Testing Reload {settings.database_url}"}


prefix = "/api"

app.include_router(router=chat_router, prefix=prefix)
