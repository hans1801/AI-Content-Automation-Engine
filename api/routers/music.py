import shutil
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

router = APIRouter(prefix="/api/music", tags=["music"])

_LIBRARY = Path("flows/image_content_generator/resource/bg-music")

_AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac"}


def _safe_path(rel: str) -> Path:
    target = (_LIBRARY / rel).resolve()
    if not str(target).startswith(str(_LIBRARY.resolve())):
        raise HTTPException(400, "Invalid path")
    return target


def _build_tree(path: Path) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for p in sorted(path.iterdir(), key=lambda x: (x.is_file(), x.name.lower())):
        rel = str(p.relative_to(_LIBRARY))
        if p.is_dir():
            items.append({"type": "dir", "name": p.name, "path": rel, "children": _build_tree(p)})
        elif p.suffix.lower() in _AUDIO_EXTENSIONS:
            items.append({"type": "file", "name": p.name, "path": rel, "size": p.stat().st_size})
    return items


@router.get("")
def list_library() -> list[dict[str, Any]]:
    if not _LIBRARY.exists():
        return []
    return _build_tree(_LIBRARY)


@router.post("/upload")
async def upload_tracks(
    files: list[UploadFile] = File(...),
    folder: str = Form(""),
) -> dict[str, list[str]]:
    dest_dir = _safe_path(folder) if folder else _LIBRARY
    dest_dir.mkdir(parents=True, exist_ok=True)
    uploaded: list[str] = []
    for file in files:
        name = Path(file.filename or "track.mp3").name
        dest = dest_dir / name
        dest.write_bytes(await file.read())
        uploaded.append(str(dest.relative_to(_LIBRARY)))
    return {"uploaded": uploaded}


@router.post("/folder")
def create_folder(name: str = Form(...), parent: str = Form("")) -> dict[str, str]:
    target = _safe_path(f"{parent}/{name}" if parent else name)
    target.mkdir(parents=True, exist_ok=True)
    return {"path": str(target.relative_to(_LIBRARY))}


@router.get("/{path:path}/stream")
def stream_track(path: str) -> FileResponse:
    target = _safe_path(path)
    if not target.is_file():
        raise HTTPException(404, "Track not found")
    return FileResponse(str(target), media_type="audio/mpeg")


@router.delete("/{path:path}")
def delete_entry(path: str) -> dict[str, str]:
    target = _safe_path(path)
    if not target.exists():
        raise HTTPException(404, "Not found")
    if target.is_dir():
        shutil.rmtree(target)
    else:
        target.unlink()
    return {"deleted": path}
