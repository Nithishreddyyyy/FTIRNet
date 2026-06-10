# ChatBot Service

FastAPI-based chatbot service for the SpectraVision system.

## Overview

An AI-powered chatbot assistant that provides:
- Interactive Q&A about polymer classification
- Guidance on FTIR spectroscopy
- Assistance with data interpretation
- System help and documentation

## Project Structure

```
chatBot/
├── app.py                   # FastAPI application setup
├── chatbot.py               # Chatbot logic and AI integration
├── prompts.py               # Prompt templates and system instructions
├── requirements.txt         # Python dependencies
└── frnt/
    └── index.html           # Frontend interface (optional)
```

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn
- Pydantic
- LLM integration library (Ollama, OpenAI, or similar)

See `requirements.txt` for complete list.

## Installation

```bash
cd chatBot
pip install -r requirements.txt
```

## Running the Service

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8001
```

The chatbot API will be available at `http://localhost:8001`

## API Endpoints

### Chat Endpoint

**POST** `/chat`

Send a message to the chatbot and receive a response.

**Request Body:**
```json
{
  "message": "What is FTIR spectroscopy?"
}
```

**Response:**
```json
{
  "response": "FTIR (Fourier Transform Infrared) spectroscopy is..."
}
```

## Configuration

### System Prompt

Edit `prompts.py` to customize:
- System role and personality
- Default behavior
- Context and expertise areas
- Conversation guidelines

### CORS Settings

The app includes CORS middleware allowing requests from all origins. Modify in `app.py` if needed.

## Key Files

- **app.py** - FastAPI application with `/chat` endpoint
- **chatbot.py** - Core chatbot logic and LLM integration
- **prompts.py** - System prompts and conversation templates
- **frnt/index.html** - Optional web interface for testing

## Features

- Async request handling
- Pydantic validation for chat messages
- CORS support for frontend integration
- Structured JSON responses
- Error handling and logging

## Integration with Frontend

The frontend can communicate with this service by sending POST requests to `/chat` with the message payload.

## LLM Integration

The `ask_chatbot()` function in `chatbot.py` should be configured to work with:
- Ollama (local models)
- OpenAI API
- Other LLM providers

Update the integration details in `chatbot.py` based on your chosen provider.

## Development Notes

- Uses FastAPI's async capabilities for high concurrency
- All responses are JSON-formatted
- Includes CORS middleware for cross-origin requests
- Logs all interactions for debugging and improvement
