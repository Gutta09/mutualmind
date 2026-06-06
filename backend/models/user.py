from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QuizAnswer(BaseModel):
    question_id: int
    answer: str


class QuizSubmission(BaseModel):
    session_id: str
    answers: list[QuizAnswer]
    investment_goal: str
    horizon_years: int
    monthly_income: Optional[str] = None


class RecommendationsRequest(BaseModel):
    session_id: str
    risk_profile: str
    investment_goal: str
    horizon_years: int
    monthly_budget: Optional[int] = 5000
