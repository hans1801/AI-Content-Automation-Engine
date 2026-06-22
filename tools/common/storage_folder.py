from pathlib import Path
from typing import Any, Generic, Type, TypeVar

from pydantic import BaseModel

StateT = TypeVar("StateT", bound=str)
T = TypeVar("T", bound="StoreRecord[Any]")


class StoreRecord(BaseModel, Generic[StateT]):
    """Base class for any model stored by FolderStore. Requires id and state."""
    id: int
    state: StateT


class FolderStore(Generic[T]):
    """
    Generic folder-based store. Each record lives as meta.json inside its own directory.
    The folder structure IS the database.
    """

    def __init__(self, ideas_dir: Path, model: Type[T]) -> None:
        self.ideas_dir = ideas_dir
        self._model = model
        ideas_dir.mkdir(parents=True, exist_ok=True)

    def _meta_path(self, record_id: int) -> Path:
        return self.ideas_dir / f"idea_{record_id:06d}" / "meta.json"

    def _read(self, path: Path) -> T:
        return self._model.model_validate_json(path.read_text(encoding="utf-8"))

    def _write(self, record: T) -> None:
        path = self._meta_path(record.id)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(record.model_dump_json(indent=2), encoding="utf-8")

    def get_all(self) -> list[T]:
        records: list[T] = []
        for folder in sorted(self.ideas_dir.glob("idea_*")):
            meta = folder / "meta.json"
            if meta.exists():
                records.append(self._read(meta))
        return records

    def get_by_id(self, record_id: int) -> T | None:
        path = self._meta_path(record_id)
        return self._read(path) if path.exists() else None

    def get_first_by_state(self, state: str) -> T | None:
        return next((r for r in self.get_all() if r.state == state), None)

    def get_next_id(self) -> int:
        all_records = self.get_all()
        return max((r.id for r in all_records), default=0) + 1

    def add(self, record: T) -> T:
        self._write(record)
        return record

    def save(self, record: T) -> None:
        if not self._meta_path(record.id).exists():
            raise ValueError(f"No record found with ID: {record.id}")
        self._write(record)
