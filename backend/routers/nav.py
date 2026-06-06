from fastapi import APIRouter, HTTPException, Query
from services.mfapi_client import get_nav_history, compute_returns

router = APIRouter()

VALID_PERIODS = {"1m", "3m", "6m", "1y", "3y", "5y", "all"}


# Must be defined BEFORE /{scheme_code}/nav — static routes take priority
@router.get("/funds/compare/nav")
async def compare_nav(
    codes: str = Query(..., description="Comma-separated scheme codes, max 3"),
    period: str = Query("1y"),
):
    if period not in VALID_PERIODS:
        raise HTTPException(status_code=400, detail=f"period must be one of {VALID_PERIODS}")

    code_list = [int(c.strip()) for c in codes.split(",") if c.strip()][:3]
    if not code_list:
        raise HTTPException(status_code=400, detail="Provide at least one scheme code")

    results = []
    for code in code_list:
        try:
            data = await get_nav_history(code, period)
            full = await get_nav_history(code, "all")
            data["returns"] = compute_returns(full["nav_data"])
            results.append(data)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error for {code}: {str(e)}")

    return {"funds": results, "period": period}


@router.get("/funds/{scheme_code}/nav")
async def fund_nav(
    scheme_code: int,
    period: str = Query("1y"),
):
    if period not in VALID_PERIODS:
        raise HTTPException(status_code=400, detail=f"period must be one of {VALID_PERIODS}")
    try:
        return await get_nav_history(scheme_code, period)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch NAV data: {str(e)}")
