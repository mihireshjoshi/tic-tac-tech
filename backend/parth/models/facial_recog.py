from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import time
from supabase import create_client, Client
import numpy as np
from PIL import Image
import io
import cv2
import face_recognition
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Supabase client setup
SUPABASE_URL = "https://gmjnaofoppvjqtnrnrax.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtam5hb2ZvcHB2anF0bnJucmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzA0MTYsImV4cCI6MjAzMjkwNjQxNn0.nUkBMwoZkcGKiH4_bqCkmFVwXpOnm8W_q77zcFAf6l0"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

app = FastAPI()

# Pydantic model for user data
class User(BaseModel):
    username: str

# Function to upload image to Supabase Storage
def upload_image(image_bytes: bytes, username: str):
    file_name = f'{username}/{int(time.time())}.jpg'
    response = supabase.storage().from_('kleos-facial-recognition').upload(file_name, image_bytes)
    
    response.raise_when_api_error()  # Automatically raises an error if the API call failed
    
    image_url = response.get('data', {}).get('Key')
    if not image_url:
        logging.error("Image URL not found in Supabase response")
        raise HTTPException(status_code=400, detail="Image URL not found in Supabase response")
    
    data = supabase.table('auth_ids').insert({'username': username, 'image_url': image_url}).execute()
    data.raise_when_api_error()  
    
    return image_url
def capture_image():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        logging.error("Could not open webcam")
        raise HTTPException(status_code=500, detail="Could not open webcam")
    
    ret, frame = cap.read()
    if not ret:
        cap.release()
        logging.error("Failed to capture image")
        raise HTTPException(status_code=500, detail="Failed to capture image")

    cap.release()
    return frame
def detect_and_encode_faces(image_array: np.ndarray):
    face_locations = face_recognition.face_locations(image_array)
    if len(face_locations) == 0:
        raise HTTPException(status_code=400, detail="No face detected in the image.")
    
    face_encodings = face_recognition.face_encodings(image_array, face_locations)
    return face_encodings

@app.post("/register/")
async def register_user(user: User):
    data = supabase.table('users').insert({'username': user.username}).execute()
    data.raise_when_api_error()  # Automatically raises an error if the API call failed
    
    return JSONResponse(status_code=200, content={"message": "User registered successfully"})

@app.post("/add_face/")
async def add_face(username: str):
    try:
        # Capture image using OpenCV
        frame = capture_image()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        face_encodings = detect_and_encode_faces(rgb_frame)
        if len(face_encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in the image.")
        _, image_encoded = cv2.imencode('.jpg', frame)
        image_bytes = image_encoded.tobytes()
        
        image_url = upload_image(image_bytes, username)
        
        return JSONResponse(status_code=200, content={"message": "Face added successfully", "image_url": image_url, "faces": face_encodings})
    except Exception as e:
        logging.error(f"Error adding face: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify_face/")
async def verify_face(username: str):
    try:
        frame = capture_image()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_encodings = detect_and_encode_faces(rgb_frame)
        if len(face_encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in the image.")

        face_to_verify = face_encodings[0]

        stored_data = supabase.table('auth_ids').select('image_url').eq('username', username).execute()
        stored_data.raise_when_api_error()  # Automatically raises an error if the API call failed
        
        is_verified = False
        for record in stored_data.get('data', []):
            stored_image_url = record['image_url']
            stored_image_response = supabase.storage().from_('kleos-facial-recognition').download(stored_image_url)
            stored_image_response.raise_when_api_error()  # Automatically raises an error if the API call failed
            
            stored_image = Image.open(io.BytesIO(stored_image_response['data']))
            stored_image_array = np.array(stored_image)
            
            stored_face_encodings = detect_and_encode_faces(stored_image_array)
            if len(stored_face_encodings) == 0:
                continue
            
            matches = face_recognition.compare_faces(stored_face_encodings, face_to_verify)
            if True in matches:
                is_verified = True
                break
        
        if is_verified:
            return JSONResponse(status_code=200, content={"message": "Face verified successfully"})
        else:
            return JSONResponse(status_code=401, content={"message": "Face verification failed"})
    except Exception as e:
        logging.error(f"Error verifying face: {e}")
        raise HTTPException(status_code=500, detail=str(e))
