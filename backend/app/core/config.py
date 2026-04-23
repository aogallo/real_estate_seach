from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = ""
    ollama_api: str = ""
    groq_api_key: str = ""
    llm_provider: str = "ollama"  # "ollama" or "groq"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf8")


settings = Settings()
