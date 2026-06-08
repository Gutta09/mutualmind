"""
Fetch all active equity/hybrid/index Direct Plan Growth funds from AMFI
and upsert them into MongoDB. Preserves existing top_holdings for the
25 curated funds; sets defaults for everything else.

Run: python seed_amfi.py
"""
import asyncio
import re
import os
import httpx
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

AMFI_URL = "https://portal.amfiindia.com/spages/NAVAll.txt"

# AMFI category → our simplified category + risk_label + default expense_ratio
CATEGORY_MAP = {
    "Equity Scheme - Large Cap Fund":              ("Large Cap",     "Moderate",     0.60),
    "Equity Scheme - Large & Mid Cap Fund":        ("Large & Mid Cap","Moderate",    0.70),
    "Equity Scheme - Multi Cap Fund":              ("Multi Cap",     "Moderate",     0.75),
    "Equity Scheme - Flexi Cap Fund":              ("Flexi Cap",     "Moderate",     0.75),
    "Equity Scheme - Mid Cap Fund":                ("Mid Cap",       "Aggressive",   0.85),
    "Equity Scheme - Small Cap Fund":              ("Small Cap",     "Aggressive",   1.00),
    "Equity Scheme - ELSS":                        ("ELSS",          "Aggressive",   0.90),
    "Equity Scheme - Sectoral/ Thematic":          ("Thematic",      "Aggressive",   1.00),
    "Equity Scheme - Dividend Yield Fund":         ("Dividend Yield","Moderate",     0.80),
    "Equity Scheme - Value Fund/ Contra Fund":     ("Value",         "Moderate",     0.80),
    "Equity Scheme - Focused Fund":                ("Focused",       "Aggressive",   0.85),
    "Hybrid Scheme - Aggressive Hybrid Fund":      ("Aggressive Hybrid","Moderate",  0.80),
    "Hybrid Scheme - Dynamic Asset Allocation or Balanced Advantage":
                                                   ("Balanced Advantage","Moderate", 0.75),
    "Hybrid Scheme - Multi Asset Allocation":      ("Multi Asset",   "Moderate",     0.80),
    "Other Scheme - Index Funds":                  ("Index",         "Moderate",     0.20),
    "Other Scheme - ETFs":                         ("ETF",           "Moderate",     0.15),
}

# Top holdings for the 25 curated funds (keyed by scheme_code)
TOP_HOLDINGS = {
    118825: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","Axis Bank","L&T","Bharti Airtel","Kotak Mahindra Bank","HCL Technologies"],
    120152: ["HDFC Bank","Reliance Industries","ICICI Bank","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","ITC","HUL"],
    118989: ["Cholamandalam Investment","Persistent Systems","Cummins India","Sundaram Finance","Delhivery","LTIMindtree","Coforge","Mphasis","Aarti Industries","Voltas"],
    118668: ["Divi's Lab","Bharti Airtel","HDFC Bank","Maruti Suzuki","ICICI Bank","Infosys","UltraTech Cement","Titan","L&T","Pidilite Industries"],
    125497: ["KPIT Technologies","Kaynes Technology","Olectra Greentech","Craftsman Automation","Cera Sanitaryware","Triveni Turbine","Praj Industries","Apar Industries","Texmaco Rail","Elgi Equipments"],
    120503: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","Axis Bank","L&T","Kotak Mahindra Bank","Bharti Airtel","TCS","SBI"],
    120716: ["HDFC Bank","Reliance Industries","ICICI Bank","Infosys","L&T","TCS","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    120586: ["Nifty 50 Index","HDFC Bank","Reliance Industries","ICICI Bank","Infosys","TCS","L&T","Bharti Airtel","HUL","Axis Bank"],
    118550: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    118825: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","Axis Bank","L&T","Bharti Airtel","Kotak Mahindra Bank","HCL Technologies"],
    120505: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    118701: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    119598: ["Zomato","Swiggy","Info Edge","Indiamart Intermesh","PB Fintech","CarTrade","Nykaa","Mamaearth","Easy Trip","RateGain"],
    118939: ["Reliance Industries","HDFC Bank","ICICI Bank","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    120684: ["Nifty Next 50 Index","Adani Enterprises","Adani Ports","DLF","Siemens","SRF","Trent","Divi's Lab","Torrent Power","Pidilite"],
    118701: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    120584: ["Nifty Midcap 150 Index","Mphasis","KPIT Technologies","Coforge","LTIMindtree","Persistent","Divi's Lab","Torrent Power","SRF","Trent"],
    120587: ["Nifty Small Cap 250 Index","KPIT Technologies","Kaynes Technology","Olectra","Craftsman Auto","Triveni Turbine","Praj Industries","Apar Industries","Texmaco Rail","Elgi"],
    118988: ["Tata Consultancy Services","Infosys","HCL Technologies","Wipro","Tech Mahindra","LTIMindtree","Mphasis","Persistent Systems","Coforge","KPIT Technologies"],
    118979: ["SBI","HDFC Bank","ICICI Bank","Kotak Mahindra Bank","Axis Bank","Bank of Baroda","Punjab National Bank","Federal Bank","IndusInd Bank","IDFC First Bank"],
    118980: ["Sun Pharma","Dr. Reddy's","Cipla","Divi's Lab","Biocon","Lupin","Alkem Lab","Torrent Pharma","Ipca Lab","Glenmark"],
    119247: ["Titan","Asian Paints","Hindustan Unilever","Nestle India","Britannia","Marico","Dabur","Godrej Consumer","United Spirits","Tata Consumer"],
    118987: ["Reliance Industries","NTPC","Power Grid","Coal India","ONGC","Tata Power","Adani Green","JSW Energy","Torrent Power","CESC"],
    120485: ["HDFC Bank","ICICI Bank","Reliance Industries","Infosys","TCS","L&T","Bharti Airtel","Axis Bank","Kotak Mahindra Bank","ITC"],
    118990: ["Muthoot Finance","Bajaj Finance","Shriram Finance","Cholamandalam","HDFC AMC","BSE","CAMS","MCX","SBI Life","HDFC Life"],
}

CURATED_AUM = {
    118825: 38200, 120152: 12500, 118989: 68000, 118668: 26000, 125497: 28000,
    120503: 45000, 120716: 32000, 120586: 18500, 118550: 22000, 120505: 15600,
    118701: 19000, 119598: 4200, 118939: 41000, 120684: 9800, 120584: 12000,
    120587: 8500, 118988: 11200, 118979: 22000, 118980: 17000, 119247: 13500,
    118987: 9800, 120485: 71000, 118990: 5600,
}

CURATED_RETURNS = {
    118825: (20.3, 15.8, 21.4), 120152: (18.7, 14.2, 19.8), 118989: (31.2, 22.5, 29.6),
    118668: (28.4, 19.8, 26.1), 125497: (38.7, 28.3, 35.2), 120503: (19.8, 14.9, 20.7),
    120716: (21.4, 16.3, 22.1), 120586: (14.2, 12.1, 18.3), 118550: (13.8, 11.9, 17.9),
    120505: (16.8, 13.4, 19.2), 118701: (17.2, 13.1, 18.7), 119598: (42.1, 31.2, None),
    118939: (22.6, 17.1, 23.4), 120684: (18.4, 13.8, 20.1), 120584: (27.3, 20.4, 27.8),
    120587: (33.1, 24.6, 31.2), 118988: (22.8, 18.4, 24.1), 118979: (21.4, 16.8, 22.3),
    118980: (18.2, 14.1, 19.8), 119247: (16.8, 13.2, 18.9), 118987: (28.6, 20.9, 26.4),
    120485: (15.9, 12.8, 18.6), 118990: (26.4, 19.7, 25.8),
}


def _extract_fund_house(name: str) -> str:
    """Derive AMC short name from scheme name."""
    name_lower = name.lower()
    amc_map = {
        "aditya birla": "Aditya Birla Sun Life", "axis": "Axis", "bajaj": "Bajaj Finserv",
        "bandhan": "Bandhan", "baroda": "Baroda BNP Paribas", "bnp": "Baroda BNP Paribas",
        "canara robeco": "Canara Robeco", "dsp": "DSP", "edelweiss": "Edelweiss",
        "franklin": "Franklin Templeton", "hdfc": "HDFC", "hsbc": "HSBC",
        "icici prudential": "ICICI Prudential", "invesco": "Invesco",
        "iti": "ITI", "jm financial": "JM Financial", "kotak": "Kotak Mahindra",
        "l&t": "L&T", "lic": "LIC", "mahindra manulife": "Mahindra Manulife",
        "mirae": "Mirae Asset", "motilal oswal": "Motilal Oswal", "navi": "Navi",
        "nippon": "Nippon India", "nj": "NJ", "old mutual": "Old Mutual",
        "parag parikh": "PPFAS", "ppfas": "PPFAS", "pgim": "PGIM India",
        "quantum": "Quantum", "quant": "Quant", "samco": "Samco",
        "sbi": "SBI", "shriram": "Shriram", "sundaram": "Sundaram",
        "tata": "Tata", "trust": "Trust MF", "union": "Union",
        "utm": "UTI", "uti": "UTI", "whiteoak": "WhiteOak", "zerodha": "Zerodha",
        "groww": "Groww",
    }
    for key, val in amc_map.items():
        if key in name_lower:
            return val
    # fallback: first two words
    words = name.split()
    return " ".join(words[:2]) if len(words) >= 2 else name


def parse_amfi(text: str) -> list[dict]:
    lines = text.split("\n")
    current_category = None
    funds = []

    for line in lines:
        line = line.strip()
        m = re.match(r"Open Ended Schemes\((.+)\)", line)
        if m:
            current_category = m.group(1)
            continue
        if not line or ";" not in line or current_category not in CATEGORY_MAP:
            continue

        parts = line.split(";")
        if len(parts) < 5:
            continue

        code_str, _, _, name, nav_str = parts[0].strip(), parts[1], parts[2], parts[3].strip(), parts[4].strip()

        name_upper = name.upper()
        if "DIRECT" not in name_upper:
            continue
        if not any(g in name_upper for g in ["GROWTH", "- GROWTH", "GROWTH OPTION", "GROWTH PLAN"]):
            continue
        if any(x in name_upper for x in ["IDCW", "DIVIDEND", "BONUS", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUAL", "DAILY", "FORTNIGHTLY"]):
            continue

        try:
            code = int(code_str)
            nav = float(nav_str)
        except ValueError:
            continue

        cat, risk, er = CATEGORY_MAP[current_category]
        funds.append({
            "scheme_code": code,
            "scheme_name": name,
            "fund_house": _extract_fund_house(name),
            "category": cat,
            "risk_label": risk,
            "expense_ratio": er,
            "current_nav": nav,
            "amfi_category": current_category,
        })

    return funds


async def seed():
    client = AsyncIOMotorClient(os.environ["MONGO_URI"])
    db = client["mutualmind"]
    col = db["funds"]

    print("Fetching AMFI data...")
    async with httpx.AsyncClient(timeout=30.0) as http:
        r = await http.get(AMFI_URL)
        r.raise_for_status()
        text = r.text

    funds = parse_amfi(text)
    print(f"Parsed {len(funds)} direct plan growth funds from AMFI")

    inserted = updated = 0
    now = datetime.now(timezone.utc)

    for f in funds:
        code = f["scheme_code"]
        r1, r3, r5 = CURATED_RETURNS.get(code, (None, None, None))
        holdings = TOP_HOLDINGS.get(code, [])
        aum = CURATED_AUM.get(code, None)

        doc = {
            "scheme_code": code,
            "scheme_name": f["scheme_name"],
            "fund_house": f["fund_house"],
            "category": f["category"],
            "risk_label": f["risk_label"],
            "expense_ratio": f["expense_ratio"],
            "current_nav": f["current_nav"],
            "aum_cr": aum,
            "returns_1y": r1,
            "returns_3y": r3,
            "returns_5y": r5,
            "top_holdings": holdings,
            "min_sip": 100,
            "tags": [f["category"].lower().replace(" ", "-"), f["risk_label"].lower()],
            "updated_at": now,
        }

        result = await col.update_one(
            {"scheme_code": code},
            {"$set": doc},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
        else:
            updated += 1

    total = await col.count_documents({})
    print(f"Done: {inserted} inserted, {updated} updated → {total} total funds in DB")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
