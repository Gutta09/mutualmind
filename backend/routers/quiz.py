from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from database import user_profiles_col
from models.user import QuizSubmission

router = APIRouter()

# Each answer A/B/C/D maps to score 1/2/3/4
ANSWER_SCORES = {"A": 1, "B": 2, "C": 3, "D": 4}


def _compute_risk_profile(answers: list) -> tuple[str, int]:
    score = sum(ANSWER_SCORES.get(a.answer.upper(), 2) for a in answers)
    if score <= 9:
        profile = "Conservative"
        description = "You prefer capital preservation with steady, low-risk returns."
    elif score <= 14:
        profile = "Moderate"
        description = "You seek balanced growth, accepting moderate market fluctuations."
    else:
        profile = "Aggressive"
        description = "You pursue high growth and can withstand significant market volatility."
    return profile, score, description


@router.post("/quiz/submit")
async def submit_quiz(body: QuizSubmission):
    profile, score, description = _compute_risk_profile(body.answers)

    doc = {
        "session_id": body.session_id,
        "risk_profile": profile,
        "quiz_answers": [a.model_dump() for a in body.answers],
        "investment_goal": body.investment_goal,
        "horizon_years": body.horizon_years,
        "monthly_income": body.monthly_income,
        "score": score,
        "created_at": datetime.now(timezone.utc),
    }

    await user_profiles_col().update_one(
        {"session_id": body.session_id},
        {"$set": doc},
        upsert=True,
    )

    return {
        "session_id": body.session_id,
        "risk_profile": profile,
        "score": score,
        "description": description,
        "investment_goal": body.investment_goal,
        "horizon_years": body.horizon_years,
    }


@router.get("/quiz/profile/{session_id}")
async def get_profile(session_id: str):
    doc = await user_profiles_col().find_one({"session_id": session_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Profile not found")
    doc.pop("_id", None)
    return doc
