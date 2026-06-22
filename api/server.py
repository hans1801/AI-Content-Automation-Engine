import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import job_manager
from api.routers import ideas

app = FastAPI(title="Content Automation Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router)


@app.on_event("startup")
async def _startup() -> None:
    job_manager.register_loop(asyncio.get_event_loop())


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
