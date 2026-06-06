from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from database import user_profiles_col, funds_col
from models.user import RecommendationsRequest
from services.claude_client import get_recommendations

router = APIRouter()


@router.post("/ai/recommendations")
async def recommendations(body: RecommendationsRequest):
    # Return cached recommendations for this session if available
    profile_doc = await user_profiles_col().find_one({"session_id": body.session_id})
    if profile_doc and profile_doc.get("recommendations"):
        return profile_doc["recommendations"]

    # Fetch all funds for Claude to select from
    cursor = funds_col().find({})
    all_funds = [
        {k: v for k, v in doc.items() if k != "_id"}
        async for doc in cursor
    ]

    profile_dict = {
        "risk_profile": body.risk_profile,
        "investment_goal": body.investment_goal,
        "horizon_years": body.horizon_years,
        "monthly_budget": body.monthly_budget,
    }

    try:
        result = await get_recommendations(profile_dict, all_funds)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    # Enrich with fund metadata
    enriched = []
    for rec in result.get("recommendations", []):
        fund = await funds_col().find_one(
            {"scheme_code": rec["scheme_code"]},
            {"scheme_name": 1, "category": 1, "risk_label": 1, "expense_ratio": 1, "returns_1y": 1},
        )
        if fund:
            rec["scheme_name"] = fund["scheme_name"]
            rec["category"] = fund["category"]
            rec["risk_label"] = fund["risk_label"]
            rec["expense_ratio"] = fund["expense_ratio"]
            rec["returns_1y"] = fund["returns_1y"]
        enriched.append(rec)

    response = {
        "recommendations": enriched,
        "ai_summary": result.get("ai_summary", ""),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    # Cache on the user profile
    await user_profiles_col().update_one(
        {"session_id": body.session_id},
        {"$set": {"recommendations": response}},
        upsert=True,
    )

    return response
