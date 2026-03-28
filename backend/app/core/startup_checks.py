import requests
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine


def check_database():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("Database connected successfully")


def check_ollama():
    response = requests.get(f"{settings.ollama_api}/tags", timeout=5)
    response.raise_for_status()
    print("Ollama connected successfully")
