# AI Content Automation Engine

A powerful, modular framework designed to automate professional video creation workflows. This project follows a strict **Tools & Pipelines** architecture, orchestrating atomic infrastructure (tools) into comprehensive, high-quality video products (pipelines).

---

## ⚡ Setup & Installation

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

That's it. FFmpeg, Whisper.cpp, Python, and all dependencies run inside containers.

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd AI-Content-Automation-Engine
   ```

2. Start everything:
   ```bash
   docker compose up --build
   ```

   **First run**: the backend automatically downloads the Whisper model (~150 MB). Takes a few extra minutes once.

3. Open the app at **http://localhost:5678** and configure your Gemini API key from the UI.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5678 |
| Backend API | http://localhost:8000 |

### 🛠️ Tech Stack
- **Language**: Python 3.11+
- **Dependency Management**: [Poetry](https://python-poetry.org/)
- **AI Engine**: [Google Gemini](https://ai.google.dev/) — text, image & audio generation
- **Transcription**: [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) — local, fast, offline
- **Video Core**: [FFmpeg](https://ffmpeg.org/)
- **Data Layer**: CSV-based lifecycle tracking

