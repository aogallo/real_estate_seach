from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(
        ...,
        description="Natural language query to search for properties (Spanish or English)",
        examples=["casas con 3 habitaciones en zona 14"],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"query": "casas con 3 habitaciones en zona 14"},
                {"query": "apartamentos menores a 200000"},
                {"query": "terrenos grandes en zona 10"},
            ]
        }
    }


class SearchResponse(BaseModel):
    sql: str = Field(
        ...,
        description="SQL query generated from the natural language input",
        examples=[
            "SELECT * FROM real_estates WHERE rooms = 3 AND location LIKE '%zona 14%'"
        ],
    )
    results: list[dict] = Field(
        ...,
        description="List of matching real estate properties",
    )
