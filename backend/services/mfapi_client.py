import os
from datetime import datetime, timezone, timedelta
import httpx
from database import nav_cache_col, funds_col

MFAPI_BASE = os.environ.get("MFAPI_BASE", "https://api.mfapi.in/mf")

PERIOD_DAYS = {
    "1m": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
    "3y": 1095,
    "5y": 1825,
    "all": None,
}


def _parse_date(date_str: str) -> datetime:
    """Convert DD-MM-YYYY to a datetime object."""
    return datetime.strptime(date_str, "%d-%m-%Y")


def _filter_by_period(nav_data: list, period: str) -> list:
    if period == "all" or period not in PERIOD_DAYS:
        return nav_data
    days = PERIOD_DAYS[period]
    cutoff = datetime.now() - timedelta(days=days)
    return [d for d in nav_data if _parse_date(d["date"]) >= cutoff]


async def get_nav_history(scheme_code: int, period: str = "1y") -> dict:
    col = nav_cache_col()

    cached = await col.find_one({"scheme_code": scheme_code})
    if cached:
        nav_data = _filter_by_period(cached["nav_data"], period)
        fund = await funds_col().find_one({"scheme_code": scheme_code}, {"scheme_name": 1})
        return {
            "scheme_code": scheme_code,
            "scheme_name": fund["scheme_name"] if fund else "",
            "nav_data": nav_data,
            "period_requested": period,
            "data_points": len(nav_data),
        }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"{MFAPI_BASE}/{scheme_code}")
        response.raise_for_status()
        raw = response.json()

    all_nav = []
    for entry in raw.get("data", []):
        try:
            all_nav.append({
                "date": datetime.strptime(entry["date"], "%d-%m-%Y").strftime("%Y-%m-%d"),
                "nav": float(entry["nav"]),
            })
        except (ValueError, KeyError):
            continue

    # Oldest-first for charts
    all_nav.reverse()

    await col.update_one(
        {"scheme_code": scheme_code},
        {"$set": {
            "scheme_code": scheme_code,
            "nav_data": all_nav,
            "fetched_at": datetime.now(timezone.utc),
        }},
        upsert=True,
    )

    fund = await funds_col().find_one({"scheme_code": scheme_code}, {"scheme_name": 1})
    filtered = _filter_by_period(all_nav, period)

    return {
        "scheme_code": scheme_code,
        "scheme_name": raw["meta"].get("scheme_name", fund["scheme_name"] if fund else ""),
        "nav_data": filtered,
        "period_requested": period,
        "data_points": len(filtered),
    }


def compute_returns(nav_data: list) -> dict:
    """Compute point-to-point returns for standard periods from oldest-first nav_data."""
    if not nav_data:
        return {}

    latest_nav = nav_data[-1]["nav"]
    latest_date = datetime.strptime(nav_data[-1]["date"], "%Y-%m-%d")

    periods = {"1m": 30, "3m": 90, "6m": 180, "1y": 365, "3y": 1095, "5y": 1825}
    returns = {}

    for label, days in periods.items():
        cutoff = latest_date - timedelta(days=days)
        candidates = [d for d in nav_data if datetime.strptime(d["date"], "%Y-%m-%d") <= cutoff]
        if candidates:
            past_nav = candidates[-1]["nav"]
            if past_nav > 0:
                pct = round(((latest_nav - past_nav) / past_nav) * 100, 2)
                returns[label] = pct

    return returns
