from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from database import news_cache_col, funds_col
from services.news_client import fetch_fund_news
from services.llm_client import get_sentiments

router = APIRouter()


def _overall_sentiment(articles: list[dict]) -> str:
    counts = {"bullish": 0, "bearish": 0, "neutral": 0}
    for a in articles:
        s = a.get("sentiment", "neutral")
        counts[s] = counts.get(s, 0) + 1
    return max(counts, key=counts.get)


@router.get("/funds/{scheme_code}/news")
async def fund_news(scheme_code: int):
    # Check cache
    cached = await news_cache_col().find_one({"scheme_code": scheme_code})
    if cached:
        cached.pop("_id", None)
        cached["cached"] = True
        return cached

    # Get fund's top holdings
    fund = await funds_col().find_one(
        {"scheme_code": scheme_code},
        {"top_holdings": 1, "scheme_name": 1},
    )
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")

    top_holdings = fund.get("top_holdings", [])
    if not top_holdings:
        raise HTTPException(status_code=422, detail="Fund has no holdings data")

    # Fetch news
    try:
        raw_articles = await fetch_fund_news(top_holdings)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"News fetch failed: {str(e)}")

    if not raw_articles:
        return {
            "scheme_code": scheme_code,
            "query_term": " OR ".join(top_holdings[:2]),
            "articles": [],
            "overall_sentiment": "neutral",
            "cached": False,
        }

    # Get Claude sentiment for all articles in one call
    try:
        sentiments = await get_sentiments(raw_articles)
    except Exception:
        sentiments = []

    sentiment_map = {s["index"]: s for s in sentiments}
    articles = []
    for i, article in enumerate(raw_articles):
        s = sentiment_map.get(i + 1, {})
        article["sentiment"] = s.get("sentiment", "neutral")
        article["sentiment_reason"] = s.get("reason", "")
        articles.append(article)

    result = {
        "scheme_code": scheme_code,
        "query_term": " OR ".join(f'"{h}"' for h in top_holdings[:2]),
        "articles": articles,
        "overall_sentiment": _overall_sentiment(articles),
        "fetched_at": datetime.now(timezone.utc),
        "cached": False,
    }

    await news_cache_col().update_one(
        {"scheme_code": scheme_code},
        {"$set": result},
        upsert=True,
    )

    return result
