from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    context: str = ""

@router.post("/query")
async def chat_query(request: ChatRequest):
    # In production, use RAG with Qdrant + OpenAI
    return {
        "response": f"I can help you understand: {request.question[:100]}...",
        "sources": ["Part 1, Chapter 1"]
    }
