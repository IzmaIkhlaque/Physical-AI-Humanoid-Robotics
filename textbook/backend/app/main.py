from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, chat

app = FastAPI(
    title="Physical AI Textbook API",
    description="Backend API for Izma Physical AI & Humanoid Robotics Textbook",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Physical AI Textbook API"}
