from app.core.config import settings
from app.repositories.real_estate_repository import RealStateRepository
from app.services import groq_service, ollama_service
from app.services.sql_validator import validate_sql


def get_llm_provider():
    if settings.llm_provider == "ollama":
        return ollama_service
    return groq_service


class RealEstateService:
    def __init__(self, respository: RealStateRepository) -> None:
        self.repository = respository

    def seach(self, natural_query: str):
        provider = get_llm_provider()
        sql = provider.generate_sql(natural_query)

        validated_sql = validate_sql(sql)

        results = self.repository.execute_dynamic_query(validated_sql)

        return {"sql": validated_sql, "results": results}

