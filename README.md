# MutualMind

AI-powered Indian mutual fund research platform. Built with React + Vite, FastAPI, MongoDB, and Claude API.

## Features

- **Risk Profiling Quiz** — 5-question onboarding → Conservative / Moderate / Aggressive profile
- **Fund Comparator** — Compare up to 3 funds with indexed NAV charts and a color-coded returns table
- **Portfolio Overlap Visualizer** — D3 Venn diagram showing shared stock holdings across selected funds
- **SIP Goal Planner** — Calculate required monthly SIP for any financial goal with a corpus growth chart
- **AI Recommendations** — Claude API suggests best-fit funds based on your risk profile and goal
- **News Sentiment** — Latest news for a fund's top holdings, scored bullish / bearish / neutral by Claude

---

## Local Development Setup

### Prerequisites

- Python 3.11+ (`/opt/homebrew/bin/python3.11` on macOS M-series)
- Node.js 18+
- MongoDB Atlas account (free M0 tier)
- Anthropic API key
- NewsAPI.org key (free tier — sign up at newsapi.org)

---

### 1. Clone and install

```bash
git clone <your-repo-url>
cd mutualmind
```

### 2. Backend setup

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy and fill in environment variables:

```bash
cp .env.example .env
# Edit .env with your values:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mutualmind
# CLAUDE_API_KEY=sk-ant-...
# NEWS_API_KEY=your_newsapi_key
# MFAPI_BASE=https://api.mfapi.in/mf
```

Seed the database (run once):

```bash
python seed.py
# Output: Seed complete: 25 inserted, 0 updated (25 total funds)
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# App at http://localhost:5173
```

---

## Project Structure

```
mutualmind/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # Motor async MongoDB client
│   ├── seed.py              # One-time fund data seeder
│   ├── models/              # Pydantic request/response models
│   ├── routers/             # API route handlers
│   │   ├── funds.py         # GET /api/funds, /api/funds/{code}
│   │   ├── nav.py           # GET /api/funds/{code}/nav, /api/funds/compare/nav
│   │   ├── quiz.py          # POST /api/quiz/submit
│   │   ├── ai.py            # POST /api/ai/recommendations
│   │   └── news.py          # GET /api/funds/{code}/news
│   └── services/
│       ├── mfapi_client.py  # mfapi.in NAV data fetcher + 6h cache
│       ├── claude_client.py # Claude API wrapper (recommendations + sentiment)
│       └── news_client.py   # NewsAPI.org client
└── frontend/
    └── src/
        ├── context/         # AppContext (session, profile, recommendations)
        ├── pages/           # Landing, Quiz, Dashboard, Comparator, Overlap, SIP, FundDetail
        ├── components/      # Charts (NAV, SIP, Venn), Funds, AI, News, UI
        ├── hooks/           # useFunds, useNAV, useNews
        └── utils/           # sipMath, navUtils, overlapUtils, api
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check — used by keep-alive cron |
| GET | `/api/funds` | List all funds (optional `?category=&risk_label=&search=`) |
| GET | `/api/funds/{code}` | Single fund details |
| GET | `/api/funds/compare/nav` | Batch NAV for multiple funds (`?codes=122639,118955&period=1y`) |
| GET | `/api/funds/{code}/nav` | NAV history with period filter |
| POST | `/api/quiz/submit` | Score quiz + save risk profile |
| GET | `/api/quiz/profile/{session_id}` | Retrieve saved profile |
| POST | `/api/ai/recommendations` | Get Claude-powered fund picks |
| GET | `/api/funds/{code}/news` | News + sentiment for a fund's top holdings |

---

## Deployment

### MongoDB Atlas (free M0)

1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Network Access → Add IP → `0.0.0.0/0`
3. Get connection string and set as `MONGO_URI`
4. Run `python seed.py` from your local machine once

### Backend → Render (free tier)

1. Push to GitHub
2. New Web Service → connect repo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env vars: `MONGO_URI`, `CLAUDE_API_KEY`, `NEWS_API_KEY`, `MFAPI_BASE`

**Keep-alive (prevents 30s cold starts):** Create a free cron at [cron-job.org](https://cron-job.org) to ping `https://your-render-url.onrender.com/health` every 14 minutes.

### Frontend → Vercel (free tier)

1. New Project → import from GitHub
2. Framework: Vite, Root Directory: `frontend`
3. Add env var: `VITE_API_BASE_URL` = your Render URL
4. Deploy

Update `backend/main.py` CORS origins with your Vercel URL before final deploy.

---

## Data Notes

NAV history comes from [mfapi.in](https://api.mfapi.in/mf) (free, no API key needed) and is cached in MongoDB for 6 hours. Expense ratios, AUM, and top holdings are seeded from AMFI disclosures and fund factsheets (accurate as of April 2026). News sentiment requires a free [NewsAPI.org](https://newsapi.org) key (100 req/day on free tier).
