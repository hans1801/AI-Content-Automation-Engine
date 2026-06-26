
from pathlib import Path
from typing import Any, ClassVar, List, Optional, Type, TypeVar

from pydantic import BaseModel, PrivateAttr

from flows.image_content_generator.pipeline.prompt_base import constants as base_constants
from flows.image_content_generator.pipeline.prompt_base.manager import BasePromptManager
from flows.image_content_generator.pipeline.prompt_base.models import VideoScript
from flows.image_content_generator.pipeline.schemas import (
    AudioAlignment,
    IdeaRaw,
    ScriptFormData,
    State,
    VideoOrientation,
)
from tools.audio_generation.audio_tool import AudioTool
from tools.audio_generation.gemini import GeminiAudioGenerator
from tools.common.base_model import BaseModelTool
from tools.common.messenger import Messenger
from tools.common.storage_folder import FolderStore
from tools.text_generation.gemini import GeminiTextGenerator
from tools.utils.text import slugify
from tools.utils.time import retry
from tools.video_editing.ffmpeg import FFmpegTool
from tools.video_editing.whisper import WhisperTool

T = TypeVar("T", bound=BaseModel)


class Pipeline(BaseModelTool):
    """
    Main pipeline for the Image Content Generator project.
    Orchestrates the creation of shorts using AI tools.
    """
    out_base: Path
    resource_base: Path
    orientation: VideoOrientation

    _text_gen: Optional[GeminiTextGenerator] = PrivateAttr(default=None)
    _audio_gen: Optional[GeminiAudioGenerator] = PrivateAttr(default=None)
    _ffmpeg: Optional[FFmpegTool] = PrivateAttr(default=None)
    _whisper: Optional[WhisperTool] = PrivateAttr(default=None)
    _prompt_manager: Optional[BasePromptManager] = PrivateAttr(default=None)
    _audio_tool: Optional[AudioTool] = PrivateAttr(default=None)
    _store: Optional[FolderStore[IdeaRaw]] = PrivateAttr(default=None)

    # Standard Output Directories
    IDEAS_DIR: ClassVar[str] = "ideas"
    AUDIOS_DIR: ClassVar[str] = "audios"
    VIDEOS_DIR: ClassVar[str] = "videos"
    EDITIONS_DIR: ClassVar[str] = "editions"

    # Standard Output Files
    SCRIPT_JSON: ClassVar[str] = "script.json"
    RAW_VIDEO: ClassVar[str] = "raw_video.mp4"
    SUBTITLED_VIDEO: ClassVar[str] = "subtitled_video.mp4"
    FINAL_AUDIO: ClassVar[str] = "final_audio.wav"
    FINAL_SUBS: ClassVar[str] = "final_subs.srt"
    FINAL_VIDEO: ClassVar[str] = "final_video.mp4"

    # Standard Scene Patterns
    SCENE_AUDIO_PATTERN: ClassVar[str] = "scene_{:04d}.wav"
    SCENE_VIDEO_PATTERN: ClassVar[str] = "scene_{:04d}.mp4"
    SCENE_VIDEO_SYNCED_PATTERN: ClassVar[str] = "scene_{:04d}_synced.mp4"
    BATCH_AUDIO_PATTERN: ClassVar[str] = "batch_{:04d}.wav"

    # Standard Resource Directories
    BG_MUSIC_DIR: ClassVar[str] = "bg-music"

    def __init__(self, **kwargs: Any):
        super().__init__(**kwargs)

    @property
    def store(self) -> FolderStore[IdeaRaw]:
        if self._store is None:
            self._store = FolderStore(ideas_dir=self.get_ideas_dir(), model=IdeaRaw)
        return self._store

    @property
    def text_gen(self) -> GeminiTextGenerator:
        if self._text_gen is None:
            self._text_gen = GeminiTextGenerator()
        return self._text_gen

    @property
    def audio_gen(self) -> GeminiAudioGenerator:
        if self._audio_gen is None:
            self._audio_gen = GeminiAudioGenerator(
                voice_name=self.prompt_manager.VOICE_NAME
            )
        return self._audio_gen

    @property
    def ffmpeg(self) -> FFmpegTool:
        if self._ffmpeg is None:
            self._ffmpeg = FFmpegTool()
        return self._ffmpeg

    @property
    def whisper(self) -> WhisperTool:
        if self._whisper is None:
            self._whisper = WhisperTool()
        return self._whisper

    @property
    def audio_tool(self) -> AudioTool:
        if self._audio_tool is None:
            bg_music_dir = self.resource_base / self.BG_MUSIC_DIR
            self._audio_tool = AudioTool(bg_music_dir=bg_music_dir)
        return self._audio_tool

    @property
    def prompt_manager(self) -> BasePromptManager:
        """Returns the shared prompt manager (audio + alignment prompts)."""
        if self._prompt_manager is None:
            self._prompt_manager = BasePromptManager()
        return self._prompt_manager

    def load_json(
        self,
        idea_id: int,
        filename: str,
        model_class: Type[T],
    ) -> T:
        """
        Loads and validates a JSON file from the idea's root directory.
        """
        path = self.get_idea_path(idea_id) / filename
        if not path.exists():
            raise FileNotFoundError(f"Missing {filename} for project {idea_id}")
        return model_class.model_validate_json(path.read_text(encoding="utf-8"))

    def save_json(self, idea_id: int, filename: str, data: BaseModel):
        """
        Saves a Pydantic model as a JSON file in the idea's root directory.
        """
        path = self.get_idea_path(idea_id) / filename
        path.write_text(data.model_dump_json(indent=2), encoding="utf-8")

    def get_out_dir(self) -> Path:
        """
        Returns the absolute path to the base output directory.
        """
        self.out_base.mkdir(parents=True, exist_ok=True)
        return self.out_base

    def get_ideas_dir(self) -> Path:
        """
        Returns the absolute path to the global ideas folder.
        """
        path = self.get_out_dir() / self.IDEAS_DIR
        path.mkdir(parents=True, exist_ok=True)
        return path

    def get_idea_path(self, idea_id: int) -> Path:
        """
        Returns the absolute path to an idea's folder.
        """
        folder_name = f"idea_{idea_id:06d}"
        path = self.get_ideas_dir() / folder_name
        path.mkdir(parents=True, exist_ok=True)
        return path

    def get_idea_subdir(self, idea_id: int, subdir: str) -> Path:
        """
        Returns the absolute path to a subdirectory within an idea's folder
        """
        path = self.get_idea_path(idea_id) / subdir
        path.mkdir(parents=True, exist_ok=True)
        return path

    def get_idea_asset_path(self, idea_id: int, subdir: str, filename: str) -> Path:
        """
        Returns the absolute path to a file within an idea's subdirectory.
        """
        return self.get_idea_subdir(idea_id, subdir) / filename

    def get_named_video_path(self, idea_id: int, title: str) -> Path:
        """
        Derives the path for the final named video based on the idea title.
        """
        title_slug = slugify(title)
        return self.get_idea_path(idea_id) / f"{title_slug}.mp4"

    def step1_generate_story(self, idea_id: int, form: ScriptFormData):
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        Messenger.info("\n--- Generating cinematic concept and script ---")

        script, title, category = self._generate_from_form(form)
        idea_obj.form = form
        idea_obj.title = title
        idea_obj.category = category
        self.save_json(idea_obj.id, self.SCRIPT_JSON, script)
        idea_obj.state = State.SCRIPT_GENERATED
        self.store.save(idea_obj)
        Messenger.success(f"Script generated: {State.SCRIPT_GENERATED} finalized.\n")

    def _generate_from_form(self, form: ScriptFormData) -> tuple[VideoScript, str, str]:
        # Predefined values use curated descriptions; custom values are passed as-is
        style_desc = base_constants.STYLE_DESCRIPTIONS.get(form.style, form.style)
        tone_desc = base_constants.TONE_DESCRIPTIONS.get(form.tone, form.tone)
        category_desc = base_constants.CATEGORY_DESCRIPTIONS.get(form.category, form.category)
        prompt = base_constants.FORM_SCRIPT_PROMPT.format(
            idea=form.idea,
            style_desc=style_desc,
            tone_desc=tone_desc,
            category_desc=category_desc,
            aspect_ratio=form.aspect_ratio,
        ) + VideoScript.get_json_format_instructions()

        Messenger.info(f"--- Generating script for: {form.idea[:60]}... ---")
        script = self.text_gen.generate_text(prompt, VideoScript)
        title = form.idea[:80].strip()
        return script, title, form.category

    @retry(max_attempts=3)
    def step3_generate_audios(self, idea_id: int, force: bool = False):
        """
        Generate Audio: Batched AI-Guided Batching (Whisper + Gemini).
        Processes scenes in groups of 10 for maximum stability and alignment precision.
        """
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        if force:
            import shutil
            audios_dir = self.get_idea_subdir(idea_obj.id, self.AUDIOS_DIR)
            if audios_dir.exists():
                shutil.rmtree(audios_dir)
                Messenger.info("Cleared existing audio files for regeneration.")

        Messenger.info("\n--- Generating batched audio for the script ---")
        script_data = self.load_json(idea_obj.id, self.SCRIPT_JSON, VideoScript)

        total_scenes = len(script_data.scenes)
        batch_size = 15

        for start_idx in range(0, total_scenes, batch_size):
            end_idx = min(start_idx + batch_size, total_scenes)
            chunk = script_data.scenes[start_idx:end_idx]
            batch_num = (start_idx // batch_size) + 1

            Messenger.info(f"Processing Batch {batch_num}: Scenes {start_idx + 1} to {end_idx}")

            # 1. Skip if all scenes in batch already exist
            missing_any = False
            for j in range(len(chunk)):
                scene_num = start_idx + j + 1
                out_path = self.get_idea_asset_path(
                    idea_obj.id, self.AUDIOS_DIR, self.SCENE_AUDIO_PATTERN.format(scene_num)
                )
                if not out_path.exists():
                    missing_any = True
                    break

            if not missing_any:
                Messenger.info(f"Skipping Batch {batch_num}: All audio files exist.")
                continue

            # 2. Synthesize chunk audio
            chunk_filename = self.BATCH_AUDIO_PATTERN.format(batch_num)
            chunk_audio_path = self.get_idea_asset_path(
                idea_obj.id, self.AUDIOS_DIR, chunk_filename
            )

            Messenger.info(f"Synthesizing audio for Batch {batch_num}...")
            chunk_text = "\n\n".join([s.narration for s in chunk])
            formatted_audio = self.prompt_manager.get_audio_prompt(chunk_text)
            self.audio_gen.text_to_speech(formatted_audio, chunk_audio_path)

            # 3. Transcribe chunk
            Messenger.info(f"Transcribing Batch {batch_num} for alignment...")
            segments = self.whisper.get_transcription_segments(chunk_audio_path)

            # 4. Align chunk
            Messenger.info(f"Aligning Batch {batch_num} via Gemini...")
            chunk_script_texts = [s.narration for s in chunk]
            prompt = self.prompt_manager.get_alignment_prompt(segments, chunk_script_texts)
            alignment = self.text_gen.generate_text(prompt, AudioAlignment)

            # 5. Validate alignment count
            if len(alignment.alignments) != len(chunk):
                # Delete corrupted chunk to force retry
                chunk_audio_path.unlink(missing_ok=True)
                chunk_audio_path.with_name(chunk_audio_path.name + ".json").unlink(missing_ok=True)
                error_msg = (
                    f"Alignment mismatch in Batch {batch_num}: "
                    f"Expected {len(chunk)}, got {len(alignment.alignments)}"
                )
                raise RuntimeError(error_msg)

            # 6. Split and Save
            Messenger.info(f"Splitting Batch {batch_num} into {len(chunk)} scene audios...")
            for al in alignment.alignments:
                # al.scene_number is 1-indexed relative to the chunk (1 to 10)
                absolute_scene_num = start_idx + al.scene_number
                out_path = self.get_idea_asset_path(
                    idea_obj.id,
                    self.AUDIOS_DIR,
                    self.SCENE_AUDIO_PATTERN.format(absolute_scene_num)
                )

                duration = al.end_time - al.start_time
                if duration < 0.5:
                    chunk_audio_path.unlink(missing_ok=True)
                    chunk_audio_path.with_name(
                        chunk_audio_path.name + ".json"
                    ).unlink(missing_ok=True)
                    raise RuntimeError(
                        f"Invalid duration (Scene {absolute_scene_num}): "
                        f"{duration:.3f}s. Forcing retry."
                    )

                self.ffmpeg.split_audio(
                    audio_in=chunk_audio_path,
                    audio_out=out_path,
                    start_time=al.start_time,
                    duration=duration
                )

            # 7. Cleanup chunk audio
            chunk_audio_path.unlink(missing_ok=True)

        # Final Update
        idea_obj.state = State.AUDIO_GENERATED
        self.store.save(idea_obj)
        Messenger.success(f"Step 3 ready: {State.AUDIO_GENERATED} finalized.\n")

    def step4_generate_videos(self, idea_id: int):
        """
        Sync & Assemble Videos: Adapts each AI-generated scene video speed to match
        its corresponding audio duration, then concatenates into raw_video.mp4.
        1. Retrieves the idea by ID.
        2. Loads script.json for scene count.
        3. Syncs each scene video speed to its audio duration.
        4. Concatenates synced scene videos into raw_video.mp4.
        5. Updates state.
        """
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        Messenger.info("\n--- Syncing AI scene videos to audio duration ---")

        # 2. Loads script.json for scene count.
        script_data = self.load_json(idea_obj.id, self.SCRIPT_JSON, VideoScript)

        # 3. Syncs each scene video speed to its audio duration.
        synced_videos: List[Path] = []
        for i in range(len(script_data.scenes)):
            video_path = self.get_idea_asset_path(
                idea_obj.id, self.VIDEOS_DIR, self.SCENE_VIDEO_PATTERN.format(i + 1)
            )
            audio_path = self.get_idea_asset_path(
                idea_obj.id, self.AUDIOS_DIR, self.SCENE_AUDIO_PATTERN.format(i + 1)
            )
            synced_path = self.get_idea_asset_path(
                idea_obj.id, self.VIDEOS_DIR, self.SCENE_VIDEO_SYNCED_PATTERN.format(i + 1)
            )

            Messenger.info(f"Syncing Scene {i+1} video speed to audio duration...")
            self.ffmpeg.sync_video_and_audio(video_path, audio_path, synced_path)
            synced_videos.append(synced_path)

        # 4. Concatenates synced scene videos into raw_video.mp4.
        raw_video = self.get_idea_asset_path(idea_obj.id, self.EDITIONS_DIR, self.RAW_VIDEO)
        self.ffmpeg.concat_videos(synced_videos, raw_video)

        # 5. Updates state.
        idea_obj.state = State.VIDEO_GENERATED
        self.store.save(idea_obj)
        Messenger.success(f"Step 4 ready: {State.VIDEO_GENERATED} finalized.\n")

    def step5_generate_subtitles(self, idea_id: int):
        """
        Generate Subtitles: Adds subtitles to the video.
        1. Retrieves the idea by ID.
        2. Prepares directories.
        3. Extracts audio.
        4. Generates srt.
        5. Adds subtitles to final video.
        6. Updates state.
        """
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        Messenger.info("\n--- Generating subtitles for the video ---")

        # 2. Prepares directories.
        raw_video = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.RAW_VIDEO
        )
        audio_wav = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.FINAL_AUDIO
        )
        subs_srt = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.FINAL_SUBS
        )
        subtitled_video = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.SUBTITLED_VIDEO
        )

        # 3. Extract Audio
        Messenger.info("Extracting audio for transcription...")
        self.ffmpeg.extract_audio(raw_video, audio_wav)

        # 4. Generate srt
        Messenger.info("Transcribing audio via Whisper.cpp...")
        self.whisper.generate_srt(audio_wav, subs_srt)

        # 5. Add Subtitles
        Messenger.info("Adding subtitles to final video...")
        self.ffmpeg.add_subtitles_to_video(raw_video, subs_srt, subtitled_video)

        # 6. Updates state.
        idea_obj.state = State.VIDEO_SUBTITLED
        self.store.save(idea_obj)
        Messenger.success(f"Step 5 ready: {State.VIDEO_SUBTITLED} finalized.\n")

    def step6_add_background_music(
        self,
        idea_id: int,
        music_path: Path,
        bg_volume: float,
    ):
        """
        Background Music: Adds a background track to the subtitled video.
        """
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        Messenger.info("\n--- Adding background music ---")

        subtitled_video = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.SUBTITLED_VIDEO
        )
        final_with_music = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.FINAL_VIDEO
        )

        if not music_path.exists():
            Messenger.error(f"Music file not found: {music_path}")
            return

        self.ffmpeg.add_background_music(
            subtitled_video,
            music_path,
            final_with_music,
            bg_volume=bg_volume,
        )

        # 5. Updates state.
        idea_obj.state = State.VIDEO_MUSIC_GENERATED
        self.store.save(idea_obj)
        Messenger.success(f"Step 6 ready: {State.VIDEO_MUSIC_GENERATED} finalized.\n")

    def step7_rename_final_video(self, idea_id: int):
        """
        Rename Final Video: Renames the final video to match the script title.
        1. Retrieves the idea by ID.
        2. Prepares directories.
        3. Renames the final video.
        4. Updates state.
        """
        idea_obj = self.store.get_by_id(idea_id)
        if not idea_obj:
            Messenger.error(f"Idea {idea_id} not found.")
            return

        Messenger.info("\n--- Final Renaming: Naming video after script title ---")

        # 2. Prepares directories.
        final_video = self.get_idea_asset_path(
            idea_obj.id, self.EDITIONS_DIR, self.FINAL_VIDEO
        )
        if not final_video.exists():
            Messenger.error(f"Final video with music not found: {final_video}")
            return

        # 3. Renames the final video.
        video_title = idea_obj.title if idea_obj.title else f"video_{idea_obj.id}"
        named_final = self.get_named_video_path(idea_obj.id, video_title)
        final_video.rename(named_final)

        # 4. Updates state.
        idea_obj.state = State.COMPLETED
        self.store.save(idea_obj)
        Messenger.success(f"Step 7 ready: {State.COMPLETED} finalized.\n")
