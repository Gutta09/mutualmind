import os
import httpx

NEWS_API_BASE = "https://newsapi.org/v2/everything"


async def fetch_fund_news(top_holdings: list[str]) -> list[dict]:
    api_key = os.environ.get("NEWS_API_KEY", "")
    if not api_key:
        return []

    # Query the top 2 holdings for relevant news
    query = " OR ".join(f'"{h}"' for h in top_holdings[:2])

    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 5,
        "apiKey": api_key,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(NEWS_API_BASE, params=params)
        response.raise_for_status()
        data = response.json()

    articles = []
    for a in data.get("articles", []):
        if not a.get("title") or a["title"] == "[Removed]":
            continue
        articles.append({
            "title": a.get("title", ""),
            "description": a.get("description", "") or "",
            "url": a.get("url", ""),
            "source": a.get("source", {}).get("name", ""),
            "published_at": a.get("publishedAt", ""),
        })

    return articles
