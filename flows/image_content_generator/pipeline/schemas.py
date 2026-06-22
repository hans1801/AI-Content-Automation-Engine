from enum import Enum
from typing import List

from pydantic import BaseModel


class State(str, Enum):
    NEW = "NEW"
    SCRIPT_GENERATED = "SCRIPT_GENERATED"
    IMAGES_GENERATED = "IMAGES_GENERATED"
    VIDEOS_GENERATED = "VIDEOS_GENERATED"  # Set manually after external AI video generation
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


class IdeaRaw(BaseModel):
    id: int
    title: str
    state: State
    category: str
