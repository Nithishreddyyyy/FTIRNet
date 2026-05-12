"""
chatbot.py
==========
Chatbot integration endpoint — wraps the Gemini-powered chatbot
from chatBot/chatbot.py into the FastAPI backend.
"""

import logging
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    session_id: str | None = None


# Lazy import — the chatbot module lives in chatBot/
def _get_chatbot_module():
    """Dynamically import the chatbot module from chatBot/.

    This keeps the chatbot logic in its original directory while
    making it accessible from the main backend API.
    """
    import sys
    from pathlib import Path

    chatbot_dir = Path(__file__).resolve().parent.parent.parent.parent / "chatBot"
    if str(chatbot_dir) not in sys.path:
        sys.path.insert(0, str(chatbot_dir))

    try:
        from chatbot import ask_chatbot
        from prompts import SYSTEM_PROMPT
        return ask_chatbot, SYSTEM_PROMPT
    except ImportError as e:
        logger.warning(f"Chatbot module import failed (is optional): {e}")
        return None, None


@router.post("/chat", tags=["ChatBot"])
async def chatbot_chat(request: ChatMessage):
    """
    Send a message to the AI chatbot and receive a response.

    The chatbot uses Google Gemini to answer questions about
    microplastics, FTIR analysis, polymer identification, and
    environmental science.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": "Message cannot be empty"},
        )

    if len(request.message) > 10000:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": "Message too long (max 10000 characters)"},
        )

    ask_chatbot, SYSTEM_PROMPT = _get_chatbot_module()

    if ask_chatbot is None:
        raise HTTPException(
            status_code=503,
            detail={
                "success": False,
                "error": "Chatbot service is not available. "
                        "Ensure GEMINI_API_KEY is set and google-genai is installed.",
            },
        )

    try:
        response_text = ask_chatbot(request.message, SYSTEM_PROMPT)
        return JSONResponse(
            content={
                "success": True,
                "response": response_text,
                "session_id": request.session_id,
            }
        )
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": f"Chatbot processing failed: {str(e)}",
            },
        )


@router.get("/health", tags=["ChatBot"])
async def chatbot_health():
    """
    Check if the chatbot service is available.
    """
    ask_chatbot, SYSTEM_PROMPT = _get_chatbot_module()

    return JSONResponse(
        content={
            "success": True,
            "chatbot_available": ask_chatbot is not None,
            "requires_api_key": True,
        }
    )