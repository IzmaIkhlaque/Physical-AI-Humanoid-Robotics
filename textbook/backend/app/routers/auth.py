from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    experience_level: str
    primary_interest: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    # In production, save to database
    token = create_token({"sub": request.email, "level": request.experience_level})
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    # In production, verify against database
    token = create_token({"sub": request.email})
    return TokenResponse(access_token=token)
