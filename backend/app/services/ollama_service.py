import json

import requests

from app.core.config import settings
from app.services.prompts import build_prompt

MODEL_NAME = "phi3"

DATABASE_ENGINE = "POSTGRESQL"


def generate_sql(natural_query: str) -> str:

    prompt = build_prompt(natural_query)

    response = requests.post(
        f"{settings.ollama_api}/api/generate",
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "format": {
                "type": "object",
                "properties": {"sql": {"type": "string"}},
                "required": ["sql"],
            },
        },
    )

    response.raise_for_status()

    result = response.json()["response"]

    sql = json.loads(result)["sql"]

    return sql

