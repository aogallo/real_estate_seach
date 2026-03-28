from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.repositories.real_estate_repository import RealStateRepository
from app.schemas.search import SearchRequest, SearchResponse
from app.services.real_estate_service import RealEstateService


chat_router = APIRouter(tags=["real", "estates", "search"])


@chat_router.post("/search", response_model=SearchResponse)
async def chat(request: SearchRequest, db: Session = Depends(get_db)):
    try:
        repository = RealStateRepository(db)
        service = RealEstateService(repository)
        return service.seach(request.query)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )
