import asyncio
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import job_manager
from api.routers import config as config_router
from api.routers import ideas


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    job_manager.register_loop(asyncio.get_event_loop())
    saved = config_router.get_gemini_key()
    if saved and not os.getenv("GEMINI_API_KEY"):
        os.environ["GEMINI_API_KEY"] = saved
    yield


app = FastAPI(title="Content Automation Engine API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5678",
        "http://localhost:5679",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router)
app.include_router(config_router.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
