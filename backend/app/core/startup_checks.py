import requests
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine


def check_database():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("Database connected successfully")


def check_ollama():
    print("llm_provider.........", settings.llm_provider)
    if settings.llm_provider != "ollama":
        print("Using Groq provider, skipping Ollama check")
        return
    response = requests.get(f"{settings.ollama_api}/api/tags", timeout=5)
    response.raise_for_status()
    print("Ollama connected successfully")
