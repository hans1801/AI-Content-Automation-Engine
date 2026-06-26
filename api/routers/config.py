import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/config", tags=["config"])

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


def _load() -> dict[str, str]:
    if CONFIG_PATH.exists():
        try:
            return dict(json.loads(CONFIG_PATH.read_text()))
        except Exception:
            return {}
    return {}


def _save(data: dict[str, str]) -> None:
    CONFIG_PATH.write_text(json.dumps(data, indent=2))


def get_gemini_key() -> str | None:
    env_key = os.getenv("GEMINI_API_KEY")
    if env_key:
        return env_key
    return _load().get("gemini_api_key")


class KeyPayload(BaseModel):
    key: str


@router.get("/gemini-key")
def check_gemini_key() -> dict[str, str | bool | None]:
    key = get_gemini_key()
    source: str | None
    if os.getenv("GEMINI_API_KEY"):
        source = "env"
    elif key:
        source = "file"
    else:
        source = None
    return {"configured": bool(key), "source": source}


@router.post("/gemini-key")
def set_gemini_key(payload: KeyPayload) -> dict[str, bool]:
    if not payload.key.strip():
        raise HTTPException(status_code=400, detail="Key cannot be empty")
    data = _load()
    data["gemini_api_key"] = payload.key.strip()
    _save(data)
    os.environ["GEMINI_API_KEY"] = payload.key.strip()
    return {"ok": True}


@router.delete("/gemini-key")
def delete_gemini_key() -> dict[str, bool]:
    data = _load()
    data.pop("gemini_api_key", None)
    _save(data)
    os.environ.pop("GEMINI_API_KEY", None)
    return {"ok": True}
