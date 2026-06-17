from typing import Sequence, Tuple, Type

from flows.image_content_generator.pipeline.prompt_base.manager import BasePromptManager
from flows.image_content_generator.pipeline.prompt_base.models import (
    BaseIdea,
    CategoryHandler,
    VideoScript,
)
from flows.image_content_generator.pipeline.prompt_shorts.spirituality import (
    constants as spirituality_constants,
)
from flows.image_content_generator.pipeline.prompt_shorts.spirituality.models import SpiritualityHandler
from tools.common.messenger import Messenger
from tools.text_generation.gemini import GeminiTextGenerator


class PromptManagerShorts(BasePromptManager):
    """Manager specific to Short videos (9:16), aggregating modular categories."""

    # Spirituality voice & audio style
    AUDIO_PROMPT: str = spirituality_constants.AUDIO_PROMPT

    VOICE_NAME: str = "enceladus"

    CATEGORIES: Sequence[Type[CategoryHandler]] = [
        SpiritualityHandler,
    ]

    def generate_full_story(
        self, content_gen: GeminiTextGenerator
    ) -> Tuple[BaseIdea, VideoScript, str]:
        """
        Executes the generation loop in 3 steps:
        1. Random Selection: Pick a category config.
        2. Idea Generation: Prompt for initial idea.
        3. Script Generation: Build structured script from idea.
        """
        # 1. Random Selection
        config = self.select_random_config()

        # 2. Idea Generation
        idea_data = content_gen.generate_text(config.idea_prompt, config.idea_model)

        # 3. Script Generation
        Messenger.info(f"\n--- Generating script for: {idea_data.title} ---")
        script_prompt = config.handler.get_full_script_prompt(idea_data)
        Messenger.info(script_prompt)
        script = content_gen.generate_text(script_prompt, VideoScript)

        return idea_data, script, config.category
