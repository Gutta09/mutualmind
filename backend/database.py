import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

_client: AsyncIOMotorClient = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(os.environ["MONGO_URI"])
    return _client


def get_db():
    return get_client()["mutualmind"]


def funds_col():
    return get_db()["funds"]


def nav_cache_col():
    return get_db()["nav_cache"]


def user_profiles_col():
    return get_db()["user_profiles"]


def news_cache_col():
    return get_db()["news_cache"]


async def create_indexes():
    db = get_db()
    await db["funds"].create_index("scheme_code", unique=True)
    await db["funds"].create_index([("scheme_name", "text")])
    await db["nav_cache"].create_index("scheme_code", unique=True)
    await db["nav_cache"].create_index("fetched_at", expireAfterSeconds=21600)
    await db["user_profiles"].create_index("session_id", unique=True)
    await db["news_cache"].create_index("scheme_code")
    await db["news_cache"].create_index("fetched_at", expireAfterSeconds=14400)
