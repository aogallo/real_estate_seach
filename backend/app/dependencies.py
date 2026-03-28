from app.core.database import SessionLocal


def get_db():
    """
    Return the db connection
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
