from typing import Optional
from sqlalchemy import text
from sqlalchemy.orm import Session


class RealStateRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def execute_dynamic_query(self, sql: str, params: Optional[dict] = None):
        result = self.db.execute(text(sql), params or {})
        return [dict(row._mapping) for row in result]
