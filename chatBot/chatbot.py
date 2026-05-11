from google import genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def ask_chatbot(user_message, system_prompt):

    try:
        # Create final prompt
        prompt = f"""
{system_prompt}

User: {user_message}

Assistant:
"""

        # Generate response
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=prompt
        )

        # Return chatbot reply
        return response.text

    except Exception as e:
        print("ERROR:", e)

        # Better readable errors
        if "RESOURCE_EXHAUSTED" in str(e):
            return "Gemini API quota exceeded. Please wait a few minutes and try again."

        return f"Error: {str(e)}"

# from google import genai
# from dotenv import load_dotenv
# import os

# load_dotenv()

# client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY")
# )

# def ask_chatbot(user_message, system_prompt):

#     return "This is a demo chatbot response"