from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.core.config import settings
from app.core.startup_checks import check_database, check_ollama
from app.routers.chat import chat_router

origins = settings.cors_origins.split(",")


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": f"Hello World Testing Reload {settings.database_url}"}


prefix = "/api"

app.include_router(router=chat_router, prefix=prefix)
