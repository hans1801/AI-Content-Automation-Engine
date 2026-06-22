import concurrent.futures
from pathlib import Path
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, StreamingResponse

from api import job_manager
from flows.image_content_generator.pipeline.pipeline import Pipeline
from flows.image_content_generator.pipeline.schemas import IdeaRaw, State, VideoOrientation
from tools.common.storage_folder import FolderStore

router = APIRouter(prefix="/api/ideas", tags=["ideas"])

_RESOURCE_BASE = Path("flows/image_content_generator/resource")
_SHORT_OUT = Path("flows/image_content_generator/out_short")
_LONG_OUT = Path("flows/image_content_generator/out_long")
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)


def _out(orientation: VideoOrientation) -> Path:
    return _SHORT_OUT if orientation == VideoOrientation.SHORT else _LONG_OUT


def _store(orientation: VideoOrientation = VideoOrientation.SHORT) -> FolderStore[IdeaRaw]:
    return FolderStore(ideas_dir=_out(orientation) / "ideas", model=IdeaRaw)


def _pipeline(orientation: VideoOrientation = VideoOrientation.SHORT) -> Pipeline:
    return Pipeline(out_base=_out(orientation), resource_base=_RESOURCE_BASE, orientation=orientation)


@router.get("")
def list_ideas(orientation: VideoOrientation = VideoOrientation.SHORT):
    return [idea.model_dump() for idea in _store(orientation).get_all()]


@router.post("/generate")
def create_idea(orientation: VideoOrientation = VideoOrientation.SHORT):
    st = _store(orientation)
    idea = st.add(IdeaRaw(id=st.get_next_id(), title="", category="", state=State.NEW))
    return idea.model_dump()


@router.get("/stream/{job_id}")
async def stream(job_id: str):
    async def _gen():
        async for msg in job_manager.stream_job(job_id):
            yield f"data: {msg}\n\n"

    return StreamingResponse(
        _gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/{idea_id}/script")
def regenerate_script(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    job_id = job_manager.create_job()
    p = _pipeline(orientation)
    _executor.submit(job_manager.run_in_job, job_id, lambda: p.step1_generate_story(idea_id))
    return {"job_id": job_id}


@router.get("/{idea_id}/script")
def get_script(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    path = _out(orientation) / "ideas" / f"idea_{idea_id:06d}" / "script.json"
    if not path.exists():
        raise HTTPException(404, "Script not found")
    return FileResponse(str(path), filename="script.json")


@router.post("/{idea_id}/images")
async def upload_images(
    idea_id: int,
    files: List[UploadFile] = File(...),
    orientation: VideoOrientation = VideoOrientation.SHORT,
):
    images_dir = _out(orientation) / "ideas" / f"idea_{idea_id:06d}" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    sorted_files = sorted(files, key=lambda f: f.filename or "")
    for i, file in enumerate(sorted_files, start=1):
        ext = Path(file.filename or "scene.png").suffix or ".png"
        content = await file.read()
        (images_dir / f"scene_{i}{ext}").write_bytes(content)

    st = _store(orientation)
    idea = st.get_by_id(idea_id)
    if not idea:
        raise HTTPException(404, "Idea not found")

    idea.state = State.IMAGES_GENERATED
    st.save(idea)
    return {"id": idea.id, "state": idea.state, "files_uploaded": len(sorted_files)}


@router.post("/{idea_id}/videos")
async def upload_videos(
    idea_id: int,
    files: List[UploadFile] = File(...),
    orientation: VideoOrientation = VideoOrientation.SHORT,
):
    videos_dir = _out(orientation) / "ideas" / f"idea_{idea_id:06d}" / "videos"
    videos_dir.mkdir(parents=True, exist_ok=True)

    sorted_files = sorted(files, key=lambda f: f.filename or "")
    for i, file in enumerate(sorted_files, start=1):
        content = await file.read()
        (videos_dir / f"scene_{i}.mp4").write_bytes(content)

    st = _store(orientation)
    idea = st.get_by_id(idea_id)
    if not idea:
        raise HTTPException(404, "Idea not found")

    idea.state = State.VIDEOS_GENERATED
    st.save(idea)
    return {"id": idea.id, "state": idea.state, "files_uploaded": len(sorted_files)}


@router.get("/{idea_id}/video")
def get_video(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    idea_dir = _out(orientation) / "ideas" / f"idea_{idea_id:06d}"
    videos = list(idea_dir.glob("*.mp4"))
    if not videos:
        raise HTTPException(404, "Video not found")
    return FileResponse(str(videos[0]), filename=videos[0].name, media_type="video/mp4")


@router.post("/{idea_id}/audio")
def generate_audio(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    job_id = job_manager.create_job()
    p = _pipeline(orientation)
    _executor.submit(job_manager.run_in_job, job_id, lambda: p.step3_generate_audios(idea_id=idea_id))
    return {"job_id": job_id}


@router.post("/{idea_id}/sync")
def generate_sync(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    job_id = job_manager.create_job()
    p = _pipeline(orientation)
    _executor.submit(job_manager.run_in_job, job_id, lambda: p.step4_generate_videos(idea_id=idea_id))
    return {"job_id": job_id}


@router.post("/{idea_id}/subtitles")
def generate_subtitles(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    job_id = job_manager.create_job()
    p = _pipeline(orientation)
    _executor.submit(job_manager.run_in_job, job_id, lambda: p.step5_generate_subtitles(idea_id=idea_id))
    return {"job_id": job_id}


@router.post("/{idea_id}/assemble")
def assemble_video(idea_id: int, orientation: VideoOrientation = VideoOrientation.SHORT):
    job_id = job_manager.create_job()
    p = _pipeline(orientation)

    def _run():
        p.step6_add_background_music(idea_id=idea_id)
        p.step7_rename_final_video(idea_id=idea_id)

    _executor.submit(job_manager.run_in_job, job_id, _run)
    return {"job_id": job_id}
