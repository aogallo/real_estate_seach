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


tags_metadata = [
    {
        "name": "properties",
        "description": "Search real estate listings using natural language queries. Queries are translated to SQL via an LLM.",
    },
    {
        "name": "health",
        "description": "Application health and status endpoints.",
    },
]

app = FastAPI(
    lifespan=lifespan,
    title="Precision Estate Engine",
    description="""
A natural language real estate search API powered by LLMs.

## How it works

Send a plain-text query and the API will:
1. Translate it to a safe SQL query using an LLM (Groq or Ollama)
2. Execute the query against the database
3. Return matching properties along with the generated SQL

## LLM Providers
- **Groq** (default in production) — cloud-based, fast inference
- **Ollama** — local model, no external API needed

## Notes
- Only `SELECT` queries are executed — no write operations allowed
- Infrastructure runs on a free tier, responses may take a few seconds
""",
    version="1.0.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "Allan Gallo",
        "url": "https://github.com/aogallo",
    },
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"], summary="Health check")
async def health():
    return {"status": "ok"}


prefix = "/api"

app.include_router(router=chat_router, prefix=prefix)
