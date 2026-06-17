# AI Content Automation Engine

A powerful, modular framework designed to automate professional video creation workflows. This project follows a strict **Tools & Pipelines** architecture, orchestrating atomic infrastructure (tools) into comprehensive, high-quality video products (pipelines).

---

## ⚡ Setup & Installation

### Prerequisites
- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation)
- [FFmpeg](https://ffmpeg.org/download.html)
- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) (for transcription)
  - Ensure you have the `whisper-cli` installed and available in your PATH.
  - **Model Required**: Download the `small` model (`ggml-small.bin`) and place it in `models/whisper/`.
- Google Gemini API Key

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   poetry install
   ```
3. Configure environment:
   ```env
   # .env
   GOOGLE_API_KEY=your_key_here
   ```

### 🏃 Running the Pipeline (Quick Start)
After installation, you can execute the full automation pipeline for **Shorts** with a single command:

```bash
make icg-s-all
```

This will run all 7 steps sequentially (Script -> Images -> Audio -> Video -> Subtitles -> Music -> Cleanup). You can also run individual steps using `make icg-s-step<N>` (e.g., `make icg-s-step1`).


### 🛠️ Tech Stack
- **Language**: Python 3.11+
- **Dependency Management**: [Poetry](https://python-poetry.org/)
- **AI Engine**: [Google Gemini](https://ai.google.dev/) — text, image & audio generation
- **Transcription**: [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) — local, fast, offline
- **Video Core**: [FFmpeg](https://ffmpeg.org/)
- **Data Layer**: CSV-based lifecycle tracking

---

## 🚀 Usage

The framework uses modular, resumable steps to ensure stability and state persistence.

1. Define your niche/project by selecting a `PromptManager` (`Shorts` or `Longs`).
2. Run the pipeline steps sequentially:

| Step | Method | Description |
|------|--------|-------------|
| 1 | `step1_generate_story` | Generates idea + full script via Gemini |
| 2 | `step2_generate_images` | Generates one image per scene via Gemini Imagen |
| 3 | `step3_generate_audios` | Batched TTS narration + Whisper alignment |
| 4 | `step4_generate_videos` | Stitches image + audio into scene clips via FFmpeg |
| 5 | `step5_generate_subtitles` | Adds SRT subtitles to the raw video |
| 6 | `step6_add_background_music` | Mixes a random background track at low volume |
| 7 | `step7_rename_final_video` | Renames output to the idea's slugified title |

3. Monitor progress in the tracking CSV (`ideas_tracking.csv`).

---

## 🏗️ Architecture: Tools & Pipelines

### 🛠️ Tools (`tools/`)
Shared, reusable atomic components that handle all infrastructure tasks:

| Tool | Description |
|------|-------------|
| `text_generation/gemini.py` | Gemini-driven text/JSON generation (scripts, ideas, alignment) |
| `image_generation/gemini.py` | Gemini Imagen batch generator with `txt2img` and `img2img` modes |
| `audio_generation/gemini.py` | Gemini TTS engine — configurable voice, outputs WAV |
| `video_editing/ffmpeg.py` | FFmpeg wrappers for stitching, transitions, subtitles, and music |
| `video_editing/whisper.py` | Whisper.cpp wrappers for transcription and SRT generation |
| `common/` | Messenger, retry logic, base models, and shared utilities |

### 🚀 Pipelines (`flows/`)
Concrete video product implementations. Each flow coordinates tools into a multi-step workflow:

- **`image_content_generator/`**: The core automated video factory. Transforms a raw niche idea into a fully-produced video (Shorts 9:16 or Longs 16:9) with synchronized AI imagery, narration, subtitles, and background music.

### 🧠 Core Innovation: Modular Prompting

This framework uses a **Pydantic-Driven, Niche-Pluggable Prompt Architecture**:

- **Logic-Inside-Models**: Pydantic models (`BaseIdea`, `VideoScript`, `CategoryHandler`) generate their own structured prompt instructions.
- **Dynamic JSON Scaling**: Mandatory output schemas are auto-injected based on field descriptions — no manual formatting needed.
- **Niche-Isolated Categories**: Each content niche (e.g., `spirituality`) lives in its own isolated module with `models.py`, `constants.py`, and `__init__.py`, cleanly registered into the manager without touching core logic.
- **Multi-format Managers**: `PromptManagerShorts` targets 9:16 Shorts; `PromptManagerLongs` targets 16:9 Longs with chunked script generation (6 chunks × 20 scenes).

---

## 📂 Project Structure

```
video-automation/
├── flows/
│   └── image_content_generator/
│       ├── pipeline/
│       │   ├── pipeline.py           # Main orchestrator (7 steps)
│       │   ├── schemas.py            # Core enums and state machine
│       │   ├── storage_csv.py        # CSV-based idea tracking
│       │   ├── prompt_base/          # Shared base models & manager
│       │   ├── prompt_shorts/        # Niche handlers for Shorts (9:16)
│       │   │   └── spirituality/     # Spirituality niche (Daily Prayer & Reflection variants)
│       │   └── prompt_longs/         # Niche handlers for Longs (16:9)
│       │       └── finances/         # Finance niche (long-form variant)
│       └── resource/                 # Style references & background music
├── tools/
│   ├── text_generation/              # Gemini text/JSON generation
│   ├── image_generation/             # Gemini image generation (batch)
│   ├── audio_generation/             # Gemini TTS + WAV writing
│   ├── video_editing/                # FFmpeg + Whisper wrappers
│   └── common/                       # Shared utilities & base classes
├── .rules/                           # Architecture patterns & coding standards
└── out_short/                        # Generated assets (IGNORED in git)
```

---

## 🎨 Niche System

Content niches are self-contained modules registered in the prompt managers. The public version ships with a **Finance** niche for both Shorts and Longs:

### Shorts — `prompt_shorts/spirituality/`
| Variant | Idea Model | Focus |
|---------|-----------|-------|
| Daily Prayer | `DailyPrayerIdea` | Daily prayers, faith, and healing frequency (432Hz/528Hz) |
| Spiritual Reflection | `SpiritualReflectionIdea` | Calm, inner peace, and spiritual reflection |

### Longs — `prompt_longs/finances/`
| Variant | Description |
|---------|-------------|
| `FinancesHandlerLong` | Long-form finance storytelling (chunked, 120 scenes) |

> **Adding your own niche**: Create a new folder inside `prompt_shorts/` or `prompt_longs/` with `models.py`, `constants.py`, and `__init__.py`. Register the handler class in the corresponding manager's `CATEGORIES` list.

---

## 🖼️ Image Generation

The image pipeline uses **Google Gemini Imagen** exclusively:

- **Aspect ratio**: Auto-selected based on orientation (`9:16` for Shorts, `16:9` for Longs).
- **Style references**: Drop `.png` files in `resource/reference/` — the generator injects them as visual anchors for every scene.
- **Batch processing**: All scenes are processed sequentially with built-in rate-limit delays.
- **Mode**: `txt2img` by default; switches to `img2img` when style or sequence references are provided.

---

## 🔊 Audio Generation

The TTS pipeline uses **Google Gemini TTS**:

- Configurable `voice_name` (default: `Fenrir`) — set per niche in the prompt manager.
- Outputs raw PCM → auto-converted to `.wav`.
- Batched narration (15 scenes per batch) with Whisper-based alignment for precise per-scene splitting.

---

## 🛠️ Standards & Guidelines

For a deep dive into our patterns, check the [`.rules/`](.rules/onboarding_checklist.md) directory:
- `01_architecture_patterns.md` — Layout and structural requirements.
- `02_coding_standards.md` — Python and Pydantic best practices.
- `standards/prompts.md` — Guidelines for the modular prompting system.
