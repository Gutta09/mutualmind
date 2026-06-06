from fastapi import APIRouter, HTTPException, Query
from database import funds_col

router = APIRouter()


def _strip_id(doc: dict) -> dict:
    doc.pop("_id", None)
    doc.pop("created_at", None)
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

    cursor = funds_col().find(query)
    funds = [_strip_id(doc) async for doc in cursor]
    return {"funds": funds, "total": len(funds)}


@router.get("/funds/{scheme_code}")
async def get_fund(scheme_code: int):
    fund = await funds_col().find_one({"scheme_code": scheme_code})
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return _strip_id(fund)
