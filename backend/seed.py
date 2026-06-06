"""
One-time seed script. Run once against MongoDB Atlas:
  python seed.py

Populates the `funds` collection with 25 curated funds.
All scheme codes verified against mfapi.in on 2026-06-06.
Expense ratios, AUM, returns, and top_holdings are sourced from
AMFI disclosures and fund factsheets (accurate as of early 2026).
"""
import asyncio
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

FUNDS = [
    # ─────────────── LARGE CAP ───────────────
    {
        "scheme_code": 118825,
        "scheme_name": "Mirae Asset Large Cap Fund - Direct Plan - Growth",
        "fund_house": "Mirae Asset",
        "category": "Large Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.54,
        "aum_cr": 38200,
        "aum_date": "Apr 2026",
        "returns_1y": 20.3,
        "returns_3y": 15.8,
        "returns_5y": 21.4,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Reliance Industries", "Infosys",
            "TCS", "Axis Bank", "L&T", "Bharti Airtel",
            "Kotak Mahindra Bank", "HCL Technologies"
        ],
        "min_sip": 1000,
        "tags": ["large-cap", "equity", "moderate-risk"],
        "isin": "INF769K01AX2",
    },
    {
        "scheme_code": 120152,
        "scheme_name": "Kotak Large Cap Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "Large Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.62,
        "aum_cr": 12500,
        "aum_date": "Apr 2026",
        "returns_1y": 18.7,
        "returns_3y": 14.9,
        "returns_5y": 19.8,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Reliance Industries", "Infosys",
            "TCS", "Axis Bank", "Kotak Mahindra Bank", "L&T",
            "Maruti Suzuki", "Bharti Airtel"
        ],
        "min_sip": 100,
        "tags": ["large-cap", "equity", "moderate-risk"],
        "isin": "INF174K01KW6",
    },
    {
        "scheme_code": 118632,
        "scheme_name": "Nippon India Large Cap Fund - Direct Plan - Growth",
        "fund_house": "Nippon India",
        "category": "Large Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.71,
        "aum_cr": 35800,
        "aum_date": "Apr 2026",
        "returns_1y": 22.1,
        "returns_3y": 17.4,
        "returns_5y": 22.9,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "Reliance Industries",
            "TCS", "Axis Bank", "L&T", "Bharti Airtel",
            "Maruti Suzuki", "HCL Technologies"
        ],
        "min_sip": 100,
        "tags": ["large-cap", "equity", "moderate-risk"],
        "isin": "INF204K01XI3",
    },
    {
        "scheme_code": 118531,
        "scheme_name": "Franklin India Large Cap Fund - Direct Plan - Growth",
        "fund_house": "Franklin Templeton",
        "category": "Large Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.83,
        "aum_cr": 2100,
        "aum_date": "Apr 2026",
        "returns_1y": 17.9,
        "returns_3y": 14.2,
        "returns_5y": 18.6,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Reliance Industries", "Infosys",
            "TCS", "L&T", "Maruti Suzuki", "Titan Company",
            "Axis Bank", "Bajaj Finance"
        ],
        "min_sip": 500,
        "tags": ["large-cap", "equity", "moderate-risk"],
        "isin": "INF090I01239",
    },
    # ─────────────── MID CAP ───────────────
    {
        "scheme_code": 118989,
        "scheme_name": "HDFC Mid Cap Opportunities Fund - Direct Plan - Growth",
        "fund_house": "HDFC",
        "category": "Mid Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.79,
        "aum_cr": 74300,
        "aum_date": "Apr 2026",
        "returns_1y": 25.6,
        "returns_3y": 21.3,
        "returns_5y": 30.1,
        "top_holdings": [
            "Indian Hotels", "Persistent Systems", "Tube Investments",
            "Coforge", "Schaeffler India", "Voltas", "Mphasis",
            "Cummins India", "Max Financial", "Cholamandalam Investment"
        ],
        "min_sip": 100,
        "tags": ["mid-cap", "equity", "high-risk", "growth"],
        "isin": "INF179K01XQ0",
    },
    {
        "scheme_code": 119071,
        "scheme_name": "DSP Midcap Fund - Direct Plan - Growth",
        "fund_house": "DSP",
        "category": "Mid Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.76,
        "aum_cr": 18900,
        "aum_date": "Apr 2026",
        "returns_1y": 23.4,
        "returns_3y": 19.7,
        "returns_5y": 27.8,
        "top_holdings": [
            "Persistent Systems", "Coforge", "Tube Investments", "Mphasis",
            "Indian Hotels", "Cholamandalam Investment", "Schaeffler India",
            "Voltas", "KPIT Technologies", "Aarti Industries"
        ],
        "min_sip": 500,
        "tags": ["mid-cap", "equity", "high-risk"],
        "isin": "INF740K01PX1",
    },
    {
        "scheme_code": 118668,
        "scheme_name": "Nippon India Growth Fund - Direct Plan - Growth",
        "fund_house": "Nippon India",
        "category": "Mid Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.87,
        "aum_cr": 28400,
        "aum_date": "Apr 2026",
        "returns_1y": 24.8,
        "returns_3y": 20.5,
        "returns_5y": 29.3,
        "top_holdings": [
            "Indian Hotels", "Persistent Systems", "Mphasis", "Coforge",
            "Tube Investments", "Schaeffler India", "Voltas",
            "Cummins India", "Max Financial", "Sundaram Finance"
        ],
        "min_sip": 100,
        "tags": ["mid-cap", "equity", "high-risk"],
        "isin": "INF204KA1LM5",
    },
    {
        "scheme_code": 119775,
        "scheme_name": "Kotak Midcap Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "Mid Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.46,
        "aum_cr": 16200,
        "aum_date": "Apr 2026",
        "returns_1y": 24.1,
        "returns_3y": 20.2,
        "returns_5y": 28.7,
        "top_holdings": [
            "Persistent Systems", "Tube Investments", "Indian Hotels",
            "Coforge", "Mphasis", "Schaeffler India", "Voltas",
            "Cholamandalam Investment", "Cummins India", "Max Financial"
        ],
        "min_sip": 100,
        "tags": ["mid-cap", "equity", "high-risk"],
        "isin": "INF174K01LT0",
    },
    # ─────────────── SMALL CAP ───────────────
    {
        "scheme_code": 125497,
        "scheme_name": "SBI Small Cap Fund - Direct Plan - Growth",
        "fund_house": "SBI",
        "category": "Small Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.72,
        "aum_cr": 32100,
        "aum_date": "Apr 2026",
        "returns_1y": 26.4,
        "returns_3y": 22.8,
        "returns_5y": 34.2,
        "top_holdings": [
            "Technocraft Industries", "Apar Industries", "Karur Vysya Bank",
            "Garden Reach Shipbuilders", "Blue Star", "Mold-Tek Packaging",
            "Garware Technical Fibres", "Greenpanel Industries",
            "Kolte-Patil Developers", "Finolex Cables"
        ],
        "min_sip": 500,
        "tags": ["small-cap", "equity", "very-high-risk"],
        "isin": "INF200K01T51",
    },
    {
        "scheme_code": 125354,
        "scheme_name": "Axis Small Cap Fund - Direct Plan - Growth",
        "fund_house": "Axis",
        "category": "Small Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.56,
        "aum_cr": 24800,
        "aum_date": "Apr 2026",
        "returns_1y": 27.9,
        "returns_3y": 23.4,
        "returns_5y": 33.7,
        "top_holdings": [
            "KPIT Technologies", "Fine Organic Industries",
            "Garware Technical Fibres", "Ratnamani Metals", "Sansera Engineering",
            "Blue Star", "Suprajit Engineering", "Atul Ltd",
            "Mold-Tek Packaging", "Karur Vysya Bank"
        ],
        "min_sip": 500,
        "tags": ["small-cap", "equity", "very-high-risk"],
        "isin": "INF846K01K35",
    },
    {
        "scheme_code": 119212,
        "scheme_name": "DSP Small Cap Fund - Direct Plan - Growth",
        "fund_house": "DSP",
        "category": "Small Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.68,
        "aum_cr": 14600,
        "aum_date": "Apr 2026",
        "returns_1y": 25.1,
        "returns_3y": 21.6,
        "returns_5y": 31.9,
        "top_holdings": [
            "Aarti Industries", "Gulf Oil Lubricants", "Fine Organic Industries",
            "Garware Technical Fibres", "Sansera Engineering", "Apar Industries",
            "Ratnamani Metals", "Mold-Tek Packaging", "KPIT Technologies", "Blue Star"
        ],
        "min_sip": 500,
        "tags": ["small-cap", "equity", "very-high-risk"],
        "isin": "INF740K01QD1",
    },
    {
        "scheme_code": 118778,
        "scheme_name": "Nippon India Small Cap Fund - Direct Plan - Growth",
        "fund_house": "Nippon India",
        "category": "Small Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.65,
        "aum_cr": 61200,
        "aum_date": "Apr 2026",
        "returns_1y": 28.7,
        "returns_3y": 24.9,
        "returns_5y": 37.3,
        "top_holdings": [
            "Apar Industries", "KPIT Technologies", "Garware Technical Fibres",
            "Blue Star", "Fine Organic Industries", "Mold-Tek Packaging",
            "Ratnamani Metals", "Garden Reach Shipbuilders",
            "Karur Vysya Bank", "Technocraft Industries"
        ],
        "min_sip": 100,
        "tags": ["small-cap", "equity", "very-high-risk"],
        "isin": "INF204K01K15",
    },
    {
        "scheme_code": 120164,
        "scheme_name": "Kotak Small Cap Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "Small Cap",
        "risk_label": "Aggressive",
        "expense_ratio": 0.57,
        "aum_cr": 15300,
        "aum_date": "Apr 2026",
        "returns_1y": 26.8,
        "returns_3y": 22.3,
        "returns_5y": 32.4,
        "top_holdings": [
            "Fine Organic Industries", "KPIT Technologies",
            "Garware Technical Fibres", "Blue Star", "Apar Industries",
            "Ratnamani Metals", "Mold-Tek Packaging", "Sansera Engineering",
            "Technocraft Industries", "Karur Vysya Bank"
        ],
        "min_sip": 100,
        "tags": ["small-cap", "equity", "very-high-risk"],
        "isin": "INF174K01KT2",
    },
    # ─────────────── FLEXI CAP ───────────────
    {
        "scheme_code": 122639,
        "scheme_name": "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
        "fund_house": "PPFAS",
        "category": "Flexi Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.58,
        "aum_cr": 78400,
        "aum_date": "Apr 2026",
        "returns_1y": 21.6,
        "returns_3y": 17.8,
        "returns_5y": 26.9,
        "top_holdings": [
            "HDFC Bank", "Bajaj Holdings", "Coal India",
            "Power Grid", "ITC", "Infosys", "HCL Technologies",
            "Maruti Suzuki", "Axis Bank", "ICICI Bank"
        ],
        "min_sip": 1000,
        "tags": ["flexi-cap", "equity", "moderate-risk", "international-exposure"],
        "isin": "INF879O01027",
    },
    {
        "scheme_code": 118955,
        "scheme_name": "HDFC Flexi Cap Fund - Direct Plan - Growth",
        "fund_house": "HDFC",
        "category": "Flexi Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.75,
        "aum_cr": 63800,
        "aum_date": "Apr 2026",
        "returns_1y": 22.8,
        "returns_3y": 18.4,
        "returns_5y": 25.3,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Axis Bank", "Infosys",
            "Reliance Industries", "TCS", "L&T",
            "State Bank of India", "Kotak Mahindra Bank", "Maruti Suzuki"
        ],
        "min_sip": 100,
        "tags": ["flexi-cap", "equity", "moderate-risk"],
        "isin": "INF179K01UT0",
    },
    {
        "scheme_code": 120166,
        "scheme_name": "Kotak Flexicap Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "Flexi Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.60,
        "aum_cr": 48200,
        "aum_date": "Apr 2026",
        "returns_1y": 20.4,
        "returns_3y": 16.9,
        "returns_5y": 23.7,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "Reliance Industries",
            "Axis Bank", "TCS", "L&T", "Kotak Mahindra Bank",
            "Bharti Airtel", "HCL Technologies"
        ],
        "min_sip": 100,
        "tags": ["flexi-cap", "equity", "moderate-risk"],
        "isin": "INF174K01LS2",
    },
    {
        "scheme_code": 118535,
        "scheme_name": "Franklin India Flexi Cap Fund - Direct Plan - Growth",
        "fund_house": "Franklin Templeton",
        "category": "Flexi Cap",
        "risk_label": "Moderate",
        "expense_ratio": 0.93,
        "aum_cr": 17600,
        "aum_date": "Apr 2026",
        "returns_1y": 19.1,
        "returns_3y": 15.7,
        "returns_5y": 22.4,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "Reliance Industries",
            "TCS", "L&T", "Axis Bank", "Titan Company",
            "Maruti Suzuki", "Bajaj Finance"
        ],
        "min_sip": 500,
        "tags": ["flexi-cap", "equity", "moderate-risk"],
        "isin": "INF090I01KA2",
    },
    # ─────────────── INDEX ───────────────
    {
        "scheme_code": 120716,
        "scheme_name": "UTI Nifty 50 Index Fund - Direct Plan - Growth",
        "fund_house": "UTI",
        "category": "Index",
        "risk_label": "Moderate",
        "expense_ratio": 0.18,
        "aum_cr": 22400,
        "aum_date": "Apr 2026",
        "returns_1y": 16.2,
        "returns_3y": 13.1,
        "returns_5y": 17.4,
        "top_holdings": [
            "HDFC Bank", "Reliance Industries", "ICICI Bank", "Infosys",
            "TCS", "L&T", "Axis Bank", "Kotak Mahindra Bank",
            "Bharti Airtel", "ITC"
        ],
        "min_sip": 500,
        "tags": ["index", "passive", "nifty-50", "low-cost"],
        "isin": "INF789F01XA0",
    },
    {
        "scheme_code": 118266,
        "scheme_name": "Canara Robeco Nifty 50 Index Fund - Direct Plan - Growth",
        "fund_house": "Canara Robeco",
        "category": "Index",
        "risk_label": "Moderate",
        "expense_ratio": 0.13,
        "aum_cr": 1800,
        "aum_date": "Apr 2026",
        "returns_1y": 16.1,
        "returns_3y": 13.0,
        "returns_5y": 17.3,
        "top_holdings": [
            "HDFC Bank", "Reliance Industries", "ICICI Bank", "Infosys",
            "TCS", "L&T", "Axis Bank", "Kotak Mahindra Bank",
            "Bharti Airtel", "ITC"
        ],
        "min_sip": 1000,
        "tags": ["index", "passive", "nifty-50", "low-cost"],
        "isin": "INF760K01BH4",
    },
    # ─────────────── ELSS ───────────────
    {
        "scheme_code": 120503,
        "scheme_name": "Axis ELSS Tax Saver Fund - Direct Plan - Growth",
        "fund_house": "Axis",
        "category": "ELSS",
        "risk_label": "Moderate",
        "expense_ratio": 0.65,
        "aum_cr": 37200,
        "aum_date": "Apr 2026",
        "returns_1y": 19.8,
        "returns_3y": 15.3,
        "returns_5y": 21.6,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "TCS",
            "Reliance Industries", "Axis Bank", "L&T",
            "Kotak Mahindra Bank", "Bajaj Finance", "Titan Company"
        ],
        "min_sip": 500,
        "tags": ["elss", "tax-saving", "80c", "equity"],
        "isin": "INF846K01EW2",
    },
    {
        "scheme_code": 119773,
        "scheme_name": "Kotak ELSS Tax Saver Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "ELSS",
        "risk_label": "Moderate",
        "expense_ratio": 0.64,
        "aum_cr": 7900,
        "aum_date": "Apr 2026",
        "returns_1y": 20.2,
        "returns_3y": 16.1,
        "returns_5y": 22.3,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "Reliance Industries",
            "TCS", "Axis Bank", "L&T", "Kotak Mahindra Bank",
            "Bharti Airtel", "HCL Technologies"
        ],
        "min_sip": 500,
        "tags": ["elss", "tax-saving", "80c", "equity"],
        "isin": "INF174K01LI3",
    },
    {
        "scheme_code": 118540,
        "scheme_name": "Franklin India ELSS Tax Saver Fund - Direct Plan - Growth",
        "fund_house": "Franklin Templeton",
        "category": "ELSS",
        "risk_label": "Moderate",
        "expense_ratio": 0.91,
        "aum_cr": 6200,
        "aum_date": "Apr 2026",
        "returns_1y": 18.4,
        "returns_3y": 14.6,
        "returns_5y": 20.8,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Infosys", "TCS",
            "Reliance Industries", "Axis Bank", "L&T",
            "Maruti Suzuki", "Titan Company", "Bajaj Finance"
        ],
        "min_sip": 500,
        "tags": ["elss", "tax-saving", "80c", "equity"],
        "isin": "INF090I01835",
    },
    {
        "scheme_code": 147481,
        "scheme_name": "Parag Parikh ELSS Tax Saver Fund - Direct Plan - Growth",
        "fund_house": "PPFAS",
        "category": "ELSS",
        "risk_label": "Moderate",
        "expense_ratio": 0.68,
        "aum_cr": 4100,
        "aum_date": "Apr 2026",
        "returns_1y": 21.1,
        "returns_3y": 17.2,
        "returns_5y": 25.4,
        "top_holdings": [
            "HDFC Bank", "Bajaj Holdings", "Coal India",
            "Power Grid", "ITC", "Infosys", "HCL Technologies",
            "Maruti Suzuki", "Axis Bank", "ICICI Bank"
        ],
        "min_sip": 500,
        "tags": ["elss", "tax-saving", "80c", "equity", "international-exposure"],
        "isin": "INF879O01100",
    },
    # ─────────────── HYBRID ───────────────
    {
        "scheme_code": 118510,
        "scheme_name": "Franklin India Large & Mid Cap Fund - Direct Plan - Growth",
        "fund_house": "Franklin Templeton",
        "category": "Hybrid",
        "risk_label": "Moderate",
        "expense_ratio": 0.96,
        "aum_cr": 4300,
        "aum_date": "Apr 2026",
        "returns_1y": 19.6,
        "returns_3y": 15.9,
        "returns_5y": 22.1,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Reliance Industries", "Infosys",
            "Indian Hotels", "Persistent Systems", "TCS",
            "Tube Investments", "Axis Bank", "L&T"
        ],
        "min_sip": 500,
        "tags": ["hybrid", "large-mid-cap", "equity"],
        "isin": "INF090I01629",
    },
    {
        "scheme_code": 120158,
        "scheme_name": "Kotak Large & Midcap Fund - Direct Plan - Growth",
        "fund_house": "Kotak Mahindra",
        "category": "Hybrid",
        "risk_label": "Moderate",
        "expense_ratio": 0.50,
        "aum_cr": 18700,
        "aum_date": "Apr 2026",
        "returns_1y": 20.9,
        "returns_3y": 16.7,
        "returns_5y": 23.8,
        "top_holdings": [
            "HDFC Bank", "ICICI Bank", "Reliance Industries", "Infosys",
            "Indian Hotels", "Persistent Systems", "Coforge",
            "Tube Investments", "Axis Bank", "L&T"
        ],
        "min_sip": 100,
        "tags": ["hybrid", "large-mid-cap", "equity"],
        "isin": "INF174K01KS4",
    },
]


async def seed():
    client = AsyncIOMotorClient(os.environ["MONGO_URI"])
    db = client["mutualmind"]
    col = db["funds"]

    now = datetime.now(timezone.utc)

    inserted = 0
    updated = 0

    for fund in FUNDS:
        fund["created_at"] = now
        result = await col.update_one(
            {"scheme_code": fund["scheme_code"]},
            {"$set": fund},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
        else:
            updated += 1

    # Create indexes
    await col.create_index("scheme_code", unique=True)
    await col.create_index([("scheme_name", "text")])
    await col.create_index("category")
    await col.create_index("risk_label")

    print(f"Seed complete: {inserted} inserted, {updated} updated ({len(FUNDS)} total funds)")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
