from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

from tools.common.storage_folder import StoreRecord


class State(str, Enum):
    NEW = "NEW"
    SCRIPT_GENERATED = "SCRIPT_GENERATED"
    VIDEOS_GENERATED = "VIDEOS_GENERATED"
    AUDIO_GENERATED = "AUDIO_GENERATED"
    VIDEO_GENERATED = "VIDEO_GENERATED"
    VIDEO_SUBTITLED = "VIDEO_SUBTITLED"
    VIDEO_MUSIC_GENERATED = "VIDEO_MUSIC_GENERATED"
    COMPLETED = "COMPLETED"


class VideoOrientation(str, Enum):
    SHORT = "short"
    LONG = "long"


class SceneAlignment(BaseModel):
    scene_number: int
    start_time: float
    end_time: float


class AudioAlignment(BaseModel):
    alignments: List[SceneAlignment]


class ScriptFormData(BaseModel):
    idea: str
    style: str = "stickman"
    category: str = "finanzas"
    tone: str = "motivacional"
    aspect_ratio: str = "9:16"


class IdeaRaw(StoreRecord[State]):
    title: str
    category: str
    form: Optional[ScriptFormData] = None
