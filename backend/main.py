from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os


# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Create OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


# Create FastAPI app
app = FastAPI(title="AI Business Assistant API")


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Business input model
# -----------------------------

class BusinessInfo(BaseModel):
    businessName: str
    businessType: str
    offer: str
    targetCustomers: str
    location: str


# -----------------------------
# Root endpoint
# -----------------------------

@app.get("/")
def root():
    return {
        "message": "AI Business Assistant API is running!"
    }


# -----------------------------
# Health check
# -----------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }


# -----------------------------
# Business information endpoint
# -----------------------------

@app.post("/api/business")
def create_business(business: BusinessInfo):
    return {
        "message": f"Business information received for {business.businessName}!",
        "business": business.model_dump()
    }


# -----------------------------
# AI content generation
# -----------------------------

@app.post("/api/generate")
def generate_content(business: BusinessInfo):

    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured on the backend."
        )

    prompt = f"""
You are an expert AI business and marketing assistant.

Create useful, professional and practical marketing content for the
following business.

Business name:
{business.businessName}

Business type:
{business.businessType}

Products or services:
{business.offer}

Target customers:
{business.targetCustomers}

Location:
{business.location}

Generate the following:

1. Social Media
Create a strong social media post suitable for Instagram and LinkedIn.
Include an engaging opening, benefits, a call-to-action and 3-5 relevant
hashtags.

2. Marketing Email
Create a professional promotional email with:
- Subject
- Greeting
- Main promotional message
- Call-to-action
- Closing

3. Product Description
Create an attractive and convincing product/service description.
Focus on benefits, value and the target customers.

4. Business Ideas
Provide exactly 5 practical business growth ideas specifically suited
to this business, its customers and its location.

Keep everything realistic, useful, professional and easy to understand.
"""


    try:

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "business_content",
                    "description": "Structured AI-generated business marketing content",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "socialMedia": {
                                "type": "string"
                            },
                            "marketingEmail": {
                                "type": "string"
                            },
                            "productDescription": {
                                "type": "string"
                            },
                            "businessIdeas": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "socialMedia",
                            "marketingEmail",
                            "productDescription",
                            "businessIdeas"
                        ],
                        "additionalProperties": False
                    }
                }
            }
        )

        # Convert AI JSON response into a Python dictionary
        import json

        generated_content = json.loads(response.output_text)

        return {
            "business": business.model_dump(),
            "socialMedia": generated_content["socialMedia"],
            "marketingEmail": generated_content["marketingEmail"],
            "productDescription": generated_content["productDescription"],
            "businessIdeas": generated_content["businessIdeas"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}"
        )
