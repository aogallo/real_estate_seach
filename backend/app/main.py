from contextlib import asynccontextmanager

from app.core.config import settings
from fastapi import FastAPI
from app.core.startup_checks import check_database, check_ollama
from app.routers.chat import chat_router
from sqlalchemy.exc import OperationalError


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        check_database()
        check_ollama()
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
