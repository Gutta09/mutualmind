from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NAVEntry(BaseModel):
    date: str
    nav: float


class Fund(BaseModel):
    scheme_code: int
    scheme_name: str
    fund_house: str
    category: str
    risk_label: str
    expense_ratio: float
    aum_cr: int
    aum_date: str
    returns_1y: float
    returns_3y: float
    returns_5y: float
    top_holdings: list[str]
    min_sip: int
    tags: list[str]
    isin: str


class FundSummary(BaseModel):
    scheme_code: int
    scheme_name: str
    fund_house: str
    category: str
    risk_label: str
    expense_ratio: float
    aum_cr: int
    returns_1y: float
    returns_3y: float
    returns_5y: float
    top_holdings: list[str]
    min_sip: int


class NAVResponse(BaseModel):
    scheme_code: int
    scheme_name: str
    nav_data: list[NAVEntry]
    period_requested: str
    data_points: int
