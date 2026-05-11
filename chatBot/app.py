from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import ask_chatbot
from prompts import SYSTEM_PROMPT

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat(request: ChatRequest):

    response = ask_chatbot(
        request.message,
        SYSTEM_PROMPT
    )

    return {
        "response": response
    }