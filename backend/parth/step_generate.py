from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
import google.generativeai as genai
import google.ai.generativelanguage as glm
import re
import json
import os
from io import BytesIO
from typing import List

app = FastAPI()

IMAGE_DIR = "D:/Competitions/TicTacTech/tic-tac-tech/backend/parth/images"
CAPTURE_DIR = "D:/Competitions/TicTacTech/tic-tac-tech/backend/parth/captures"

API_KEY = "AIzaSyApEBnz_XHwaeDUrBgYL31wq4yN6RcyiJA"
genai.configure(api_key=API_KEY)

def capture(image_files):
    all_steps = []
    all_json_data = []
    for image_file in image_files:
        with Image.open(image_file) as img:
            with BytesIO() as buffer:
                ext = os.path.splitext(image_file)[1].lower() if os.path.splitext(image_file)[1] else ''
                if ext == '.jpg' or ext == '.jpeg':
                    img_format = 'JPEG'
                    mime_type = 'image/jpeg'
                elif ext == '.png':
                    img_format = 'PNG'
                    mime_type = 'image/png'
                else:
                    raise ValueError("Unsupported image format")
                
                img.save(buffer, format=img_format)
                image_bytes = buffer.getvalue()
                
                model1 = genai.GenerativeModel("gemini-pro-vision")
                response1 = model1.generate_content(glm.Content(parts=[
                    glm.Part(text='The image is a banking form. Provide a response with an extremely concise, step-by-step guidance on filling each parameter in the form. Each step should cover only one parameter. Ensure the number of steps equals the number of parameters. Return a list of strings in this format ["Step 1: Description of how to fill the first parameter","Step 2: Description of how to fill the second parameter "]. Do not repeat "Step" in the description. Do not generate * and if generated replace it with a special character.'),
                    glm.Part(inline_data=glm.Blob(mime_type=mime_type, data=image_bytes)) 
                ]))
                
                if response1 and response1.parts:
                    result1 = response1.parts[0].text
                    steps = [desc.strip() for desc in re.split(r'\d+\.\s', result1) if desc.strip()]
                    all_steps.extend(steps)
                else:
                    print("No valid parts found in response or response was blocked.")
                model2 = genai.GenerativeModel("gemini-pro-vision")
                response2 = model2.generate_content(glm.Content(parts=[
                    glm.Part(text='The Images is a banking form. From the form, return a json which will contain the form value asked along with an example for it.Replace spaces with _ . For example, the form has a option of first name , account number, last name ,phone number. It should a json like {"first_name":"John","account_number":42132123,"last_name":"Doe","phone_number":9192939472}]. Remember that this is just an example and if you encounter with this example, dont limit yourself to generate the above json. If you do not encounter any of the json example pairs, use your own understanding and logic to create the json.'),
                    glm.Part(inline_data=glm.Blob(mime_type=mime_type, data=image_bytes))
                ]))

                if response2 and response2.parts:
                    result2 = response2.parts[0].text
                    json_objects = re.findall(r'{.*?}', result2, re.DOTALL)
                    for obj in json_objects:
                        try:
                            json_data = json.loads(obj)
                            all_json_data.append(json_data)
                        except json.JSONDecodeError as e:
                            print(f"Error decoding JSON: {e}")
                else:
                    print("No valid parts found in response or response was blocked.")
                
    return all_steps, all_json_data

@app.get("/images")
def list_images():
    try:
        files = os.listdir(IMAGE_DIR)
        image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
        return {"images": image_files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-ocr")
async def process_ocr(files: List[UploadFile] = File(...)):
    try:
        all_responses = []
        for file in files:
            contents = await file.read()
            file_path = os.path.join(CAPTURE_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(contents)
            
            response = capture([file_path])
            all_responses.append({file.filename: response})
        return all_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
