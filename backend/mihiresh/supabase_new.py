from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uvicorn

app = FastAPI()

# Added Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

load_dotenv()
supabase_api = os.getenv("SUPABASE_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")

supabase: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_api)

@app.post("/login")
async def user_login(request: Request):
    try:
        data = await request.json()  # Use await here
        email = data["email"]
        password = data["password"]
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        auth_id = response.user.id

        print(auth_id)
        return JSONResponse(content={"message": "Logged in successfully", "success": True, "auth_id": auth_id})
    except Exception as e:
        print(f"\n\nError in login is:\n{e}")
        return JSONResponse(content={"message": "Error while logging in", "success": False}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
