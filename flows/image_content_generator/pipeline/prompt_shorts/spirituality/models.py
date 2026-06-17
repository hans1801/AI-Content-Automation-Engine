from pydantic import Field

from flows.image_content_generator.pipeline.prompt_base.models import BaseIdea, CategoryHandler
from flows.image_content_generator.pipeline.prompt_shorts.spirituality import (
    constants as spirituality_constants,
)


class DailyPrayerIdea(BaseIdea):
    """
    Idea model for daily prayer and spiritual healing stories.
    """
    day_of_week: str = Field(description="Día de la semana para la oración (ej. Lunes, Miércoles, Diario)")
    spiritual_theme: str = Field(description="Tema o enfoque espiritual de la oración (ej. Fuerza para la semana, paz, ansiedad)")
    bible_verse: str = Field(description="Versículo bíblico clave que sirve de base en español (ej. Filipenses 4:13)")
    target_audience: str = Field(description="Descripción de la audiencia a la que va dirigida (ej. Personas sin motivación, estresadas)")
    healing_frequency: str = Field(description="Frecuencia de sanación recomendada en Hz (ej. 432Hz, 528Hz)")

    IDEA_PROMPT = spirituality_constants.IDEA_PROMPT_PRAYER


class SpiritualReflectionIdea(BaseIdea):
    """
    Idea model for spiritual reflection and inner peace stories.
    """
    spiritual_theme: str = Field(description="Tema espiritual de la reflexión (ej. Confiar en Dios, soltar el control)")
    bible_verse: str = Field(description="Versículo bíblico clave que inspira la reflexión en español (ej. Isaías 40:31)")
    key_reflection: str = Field(description="Mensaje espiritual central o reflexión clave a transmitir")
    target_audience: str = Field(description="Audiencia a la que se dirige la reflexión (ej. Personas solas o angustiadas)")
    healing_frequency: str = Field(description="Frecuencia de sanación recomendada en Hz (ej. 528Hz, 432Hz)")

    IDEA_PROMPT = spirituality_constants.IDEA_PROMPT_REFLECTION


class SpiritualityHandler(CategoryHandler):
    """
    Specialized handler for Spirituality-themed short videos.
    Encapsulates Daily Prayer and Spiritual Reflection variants.
    """

    SCRIPT_PROMPT = spirituality_constants.SCRIPT_PROMPT
    idea_variants = [
        DailyPrayerIdea,
        SpiritualReflectionIdea,
    ]
