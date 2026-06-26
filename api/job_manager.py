import asyncio
import sys
import uuid
from typing import AsyncGenerator, Dict

_jobs: Dict[str, asyncio.Queue[str]] = {}
_loop: asyncio.AbstractEventLoop | None = None

_DONE = "__DONE__"


def register_loop(loop: asyncio.AbstractEventLoop) -> None:
    global _loop
    _loop = loop


def create_job() -> str:
    job_id = str(uuid.uuid4())
    _jobs[job_id] = asyncio.Queue()
    return job_id


def _put(job_id: str, msg: str) -> None:
    if _loop and job_id in _jobs:
        asyncio.run_coroutine_threadsafe(_jobs[job_id].put(msg), _loop)


class JobWriter:
    """Captures print() output from pipeline threads and routes it to an async queue."""

    def __init__(self, job_id: str) -> None:
        self._job_id = job_id
        self._buf = ""

    def write(self, text: str) -> None:
        self._buf += text
        while "\n" in self._buf:
            line, self._buf = self._buf.split("\n", 1)
            if line:
                _put(self._job_id, line)

    def flush(self) -> None:
        if self._buf.strip():
            _put(self._job_id, self._buf)
            self._buf = ""


def run_in_job(job_id: str, fn: object) -> None:
    """Run fn() in the current thread, capturing stdout → job queue."""
    writer = JobWriter(job_id)
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = writer  # type: ignore[assignment]
    sys.stderr = writer  # type: ignore[assignment]
    try:
        fn()  # type: ignore[operator]
    except Exception as exc:
        writer.write(f"❌ Error: {exc}\n")
    finally:
        writer.flush()
        sys.stdout = old_out
        sys.stderr = old_err
        _put(job_id, _DONE)


async def stream_job(job_id: str) -> AsyncGenerator[str, None]:
    if job_id not in _jobs:
        return
    q = _jobs[job_id]
    while True:
        try:
            msg = await asyncio.wait_for(q.get(), timeout=300)
        except asyncio.TimeoutError:
            yield "[TIMEOUT]"
            _jobs.pop(job_id, None)
            return
        if msg == _DONE:
            yield "[DONE]"
            _jobs.pop(job_id, None)
            return
        yield msg
