import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import create_indexes
from routers import funds, nav, quiz, ai, news

load_dotenv()

app = FastAPI(title="MutualMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mutualmind.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(funds.router, prefix="/api")
app.include_router(nav.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(news.router, prefix="/api")


@app.on_event("startup")
async def startup():
    await create_indexes()


@app.get("/health")
async def health():
    return {"status": "ok"}
