import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_signup():
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "password123",
        "experience_level": "beginner",
        "primary_interest": "humanoid"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login():
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_chat_query():
    response = client.post("/chat/query", json={
        "question": "What is Physical AI?",
        "context": ""
    })
    assert response.status_code == 200
    assert "response" in response.json()
