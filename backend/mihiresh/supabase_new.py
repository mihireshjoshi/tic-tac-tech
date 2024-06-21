from fastapi import FastAPI,File,UploadFile,Form, Request, HTTPException, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import uuid
import uvicorn
import random
import string
from datetime import date, datetime
from dotenv import load_dotenv
import os


# Initialised the app here
app = FastAPI()

# Added Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

load_dotenv()
supabase_api = os.getenv("SUPABASE_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")

supabase: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_api)




