import os
import json
from groq import Groq

_client = None

MODEL = "llama-3.3-70b-versatile"


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client


RECOMMENDATIONS_SYSTEM = """You are MutualMind, an AI financial advisor for Indian mutual funds.
Given a user's risk profile, investment goal, and time horizon, recommend 3–5 funds from the provided list.
Select ONLY from the provided fund list. Respond with valid JSON only — no text outside the JSON."""

SENTIMENT_SYSTEM = """You are a financial sentiment analyzer for Indian mutual fund investors.
Analyze each news article's title and description. Respond with valid JSON only.
Sentiment must be exactly one of: "bullish", "bearish", "neutral"."""


def _build_recommendations_prompt(profile: dict, funds: list) -> str:
    stripped_funds = [
        {
            "scheme_code": f["scheme_code"],
            "scheme_name": f["scheme_name"],
            "category": f["category"],
            "risk_label": f["risk_label"],
            "returns_1y": f.get("returns_1y"),
            "returns_3y": f.get("returns_3y"),
            "returns_5y": f.get("returns_5y"),
            "expense_ratio": f.get("expense_ratio"),
        }
        for f in funds
    ]

    return f"""User Profile:
- Risk Tolerance: {profile["risk_profile"]}
- Goal: {profile["investment_goal"]}
- Time Horizon: {profile["horizon_years"]} years
- Monthly Budget: ₹{profile.get("monthly_budget", 5000)}

Available Funds (select 3-5 from this list only):
{json.dumps(stripped_funds, indent=2)}

Respond with this exact JSON:
{{
  "recommendations": [
    {{
      "scheme_code": <number>,
      "reason": "<one sentence: why this fund fits this user's profile and goal>",
      "allocation_pct": <integer, all must sum to 100>
    }}
  ],
  "ai_summary": "<2-3 sentences: overall investment strategy for this user>"
}}"""


def _build_sentiment_prompt(articles: list) -> str:
    articles_text = "\n\n".join([
        f"{i + 1}. Title: {a.get('title', '')}\nDescription: {a.get('description', '')}"
        for i, a in enumerate(articles)
    ])
    return f"""Analyze the sentiment of these {len(articles)} financial news articles for Indian investors:

{articles_text}

Respond with this exact JSON:
{{
  "sentiments": [
    {{
      "index": <1-based integer>,
      "sentiment": "bullish" | "bearish" | "neutral",
      "reason": "<10-15 words explaining the sentiment>"
    }}
  ]
}}"""


async def get_recommendations(profile: dict, funds: list) -> dict:
    prompt = _build_recommendations_prompt(profile, funds)
    response = get_client().chat.completions.create(
        model=MODEL,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": RECOMMENDATIONS_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


async def get_sentiments(articles: list) -> list:
    if not articles:
        return []
    prompt = _build_sentiment_prompt(articles)
    response = get_client().chat.completions.create(
        model=MODEL,
        max_tokens=512,
        messages=[
            {"role": "system", "content": SENTIMENT_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
    )
    result = json.loads(response.choices[0].message.content)
    return result.get("sentiments", [])
