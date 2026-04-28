from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = ""
    ollama_api: str = ""
    groq_api_key: str = ""
    llm_provider: str = "ollama"  # "ollama" or "groq"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf8")


settings = Settings()
