from pydantic import BaseModel
from typing import Optional


class NewsArticle(BaseModel):
    title: str
    description: Optional[str] = ""
    url: str
    source: str
    published_at: str
    sentiment: Optional[str] = None
    sentiment_reason: Optional[str] = None
