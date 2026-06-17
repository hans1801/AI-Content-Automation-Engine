from typing import Any, Type, TypeVar

from pydantic import BaseModel

from tools.common.gemini_base import GeminiBase

T = TypeVar("T", bound=BaseModel)


class GeminiTextGenerator(GeminiBase):
    text_model: str = "gemini-2.5-flash"

    def __init__(self, **kwargs: Any):
        super().__init__(**kwargs)

    def generate_text(self, prompt: str, schema: Type[T]) -> T:
        """
        Generates content with Gemini and parses it into a Pydantic model.
        """
        response = self.client.models.generate_content(
            model=self.text_model,
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': schema,
            }
        )
        self._extract_usage(response, self.text_model)

        if not response.text:
            raise RuntimeError("❌ No hay respuesta de Gemini")

        return schema.model_validate_json(response.text)
