from fastapi import APIRouter, HTTPException, Query
from database import funds_col

router = APIRouter()


_LIST_FIELDS = {
    "scheme_code": 1, "scheme_name": 1, "fund_house": 1, "category": 1,
    "risk_label": 1, "expense_ratio": 1, "returns_1y": 1, "returns_3y": 1,
    "returns_5y": 1, "current_nav": 1, "aum_cr": 1, "min_sip": 1,
    "top_holdings": 1, "_id": 0,
}


def _strip_id(doc: dict) -> dict:
    doc.pop("_id", None)
    doc.pop("created_at", None)
    doc.pop("updated_at", None)
    doc.pop("amfi_category", None)
    return doc


@router.get("/funds")
async def list_funds(
    category: str = Query(None),
    risk_label: str = Query(None),
    search: str = Query(None),
):
    query = {}
    if category:
        query["category"] = category
    if risk_label:
        query["risk_label"] = risk_label
    if search:
        query["$text"] = {"$search": search}

    cursor = funds_col().find(query, _LIST_FIELDS).sort("scheme_name", 1)
    funds = [doc async for doc in cursor]
    return {"funds": funds, "total": len(funds)}


@router.get("/funds/{scheme_code}")
async def get_fund(scheme_code: int):
    fund = await funds_col().find_one({"scheme_code": scheme_code})
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return _strip_id(fund)
