from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os


# Load variables from .env
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Create OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


app = FastAPI(title="AI Business Assistant API")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-business-assistant-ruby.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BusinessInfo(BaseModel):
    businessName: str
    businessType: str
    offer: str
    targetCustomers: str
    location: str


@app.get("/")
def root():
    return {
        "message": "AI Business Assistant API is running!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/api/business")
def create_business(business: BusinessInfo):
    return {
        "message": f"Business information received for {business.businessName}!",
        "business": business.model_dump()
    }


@app.post("/api/generate")
def generate_content(business: BusinessInfo):

    prompt = f"""
You are a professional marketing assistant.

Create marketing content for this business:

Business name: {business.businessName}
Business type: {business.businessType}
Products or services: {business.offer}
Target customers: {business.targetCustomers}
Location: {business.location}

Generate:

1. One Instagram post
2. One LinkedIn post
3. Five relevant hashtags
4. One short promotional message

Keep the content professional, engaging, and suitable for the target customers.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "business": business.model_dump(),
        "generated_content": response.output_text
    }
    