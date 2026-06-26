#!/bin/bash
set -e

MODEL_PATH="${WHISPER_MODEL_PATH:-/opt/whisper/ggml-small.bin}"

if [ ! -f "$MODEL_PATH" ]; then
    echo "📥 Descargando modelo Whisper (~150MB)..."
    mkdir -p "$(dirname "$MODEL_PATH")"
    curl -L --retry 5 --retry-delay 5 --progress-bar \
        -o "$MODEL_PATH" \
        "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
    echo "✅ Modelo descargado en $MODEL_PATH"
else
    echo "✅ Modelo Whisper encontrado en $MODEL_PATH"
fi

exec "$@"
