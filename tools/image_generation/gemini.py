import time
from pathlib import Path
from typing import Any, List, Optional, cast

from google.genai import types
from PIL import Image

from tools.common.gemini_base import GeminiBase
from tools.common.messenger import Messenger
from tools.image_generation.midjourney import ImageTask


class GeminiImageGenerator(GeminiBase):
    image_model: str = "gemini-3.1-flash-image-preview"
    aspect_ratio: str
    style_references: List[Path] = []

    def __init__(
        self,
        aspect_ratio: str,
        reference_dir: Optional[Path] = None,
        **kwargs: Any
    ) -> None:
        style_refs = []
        if reference_dir and reference_dir.exists():
            style_refs = sorted(reference_dir.glob("*.png"))

        super().__init__(
            aspect_ratio=aspect_ratio,
            style_references=style_refs,
            **kwargs
        )

    def generate_image(
        self,
        prompt: str,
        output_path: Path,
        style_references: List[Path] = [],
        sequence_reference: Optional[Path] = None
    ) -> None:
        """Generates an image with Gemini and saves it to disk."""
        time.sleep(5)

        output_path.parent.mkdir(parents=True, exist_ok=True)

        contents = self._prepare_contents(prompt, style_references, sequence_reference)
        config = types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(aspect_ratio=self.aspect_ratio, image_size="1K")
        )

        response = self.client.models.generate_content(
            model=self.image_model,
            contents=contents,
            config=config
        )

        if not response or not response.parts:
            raise RuntimeError("❌ Gemini Image no devolvió partes")

        self._extract_usage(response, self.image_model)
        image = self._extract_image(response)
        image.save(output_path)

        is_ref = style_references or sequence_reference
        msg = f"Imagen generada ({'img2img' if is_ref else 'txt2img'}): {output_path}"
        Messenger.image(msg)

    def generate_images(self, tasks: List[ImageTask], max_attempts: int = 3) -> None:
        """
        Generates images in batch for a list of ImageTask objects.
        Processes sequentially (Gemini API is synchronous).

        Each scene is retried up to ``max_attempts`` times. A scene that still
        fails is recorded and skipped so the rest of the batch keeps running;
        if any scene ultimately failed, an aggregated error is raised at the end
        so the idea is not marked complete with a missing image. Already-failed
        scenes are simply absent from disk, so a later run regenerates only them.
        """
        total = len(tasks)
        Messenger.info(f"Batch Processing: {total} images via Gemini")

        failures: List[tuple[str, str]] = []
        for i, task in enumerate(tasks, start=1):
            Messenger.info(f"Generating image {i}/{total}: {task.output_path.name}")
            last_error: Optional[Exception] = None
            for attempt in range(1, max_attempts + 1):
                try:
                    self.generate_image(
                        prompt=task.prompt,
                        output_path=task.output_path,
                        style_references=self.style_references,
                    )
                    last_error = None
                    break
                except Exception as e:  # noqa: BLE001 - keep the batch going
                    last_error = e
                    Messenger.warning(
                        f"Attempt {attempt}/{max_attempts} failed for "
                        f"{task.output_path.name}: {e}"
                    )

            if last_error is not None:
                Messenger.error(
                    f"Skipping {task.output_path.name} after {max_attempts} attempts."
                )
                failures.append((task.output_path.name, str(last_error)))

        if failures:
            names = ", ".join(name for name, _ in failures)
            raise RuntimeError(
                f"❌ {len(failures)}/{total} images failed after retries: {names}. "
                f"Last error: {failures[-1][1]}"
            )

        Messenger.step_success(f"Batch complete: {total} images generated.")

    def _prepare_contents(
        self,
        prompt: str,
        style_references: List[Path],
        sequence_reference: Optional[Path]
    ) -> List[Any]:
        """Prepares the contents list for the Gemini API call."""
        contents: List[Any] = [f"Primary Prompt: {prompt}"]

        if style_references:
            contents.append("--- STYLE REFERENCES (Maintain this visual aesthetic) ---")
            for ref_path in style_references:
                if ref_path.exists():
                    contents.append(Image.open(ref_path))

        if sequence_reference and sequence_reference.exists():
            contents.append("--- SEQUENCE REFERENCE (Maintain consistency) ---")
            contents.append(Image.open(sequence_reference))

        return contents

    def _extract_image(self, response: Any) -> Image.Image:
        """Extracts the image from the Gemini response."""
        image: Optional[Image.Image] = None
        for part in response.parts:
            if part.text:
                Messenger.info(f"Gemini thoughts: {part.text}")
            elif part.inline_data:
                image = cast(Image.Image, part.as_image())
                break

        if image is None:
            raise RuntimeError("❌ No se encontró imagen en la respuesta de Gemini")
        return image
