from fastapi import APIRouter


chat_router = APIRouter()


@chat_router.post("/search")
async def chat():
    return {"test": 2}
