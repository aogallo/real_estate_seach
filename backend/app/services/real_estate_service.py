from app.repositories.real_estate_repository import RealStateRepository
from app.services.ollama_service import generate_sql
from app.services.sql_validator import validate_sql


class RealEstateService:
    def __init__(self, respository: RealStateRepository) -> None:
        self.repository = respository

    def seach(self, natural_query: str):
        sql = generate_sql(natural_query)

        print("service....layer...", sql)

        validated_sql = validate_sql(sql)

        results = self.repository.execute_dynamic_query(validated_sql)

        return {"sql": validated_sql, "results": results}
