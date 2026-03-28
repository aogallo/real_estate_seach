from contextlib import asynccontextmanager

from app.core.config import settings
from fastapi import FastAPI
from app.core.startup_checks import check_database, check_ollama
from app.routers.chat import chat_router
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


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
