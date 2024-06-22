from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
import google.generativeai as genai
import google.ai.generativelanguage as glm
import re
import json
import os
from io import BytesIO

app = FastAPI()

IMAGE_DIR = "D:/Competitions/TicTacTech/tic-tac-tech/backend/parth/images"  
CAPTURE_DIR = "D:/Competitions/TicTacTech/tic-tac-tech/backend/parth/captures"  

API_KEY = "AIzaSyApEBnz_XHwaeDUrBgYL31wq4yN6RcyiJA"
genai.configure(api_key=API_KEY)

def capture(image_file):
    all_json_data = []
    with Image.open(image_file) as img:
        with BytesIO() as buffer:
            ext = os.path.splitext(image_file)[1].lower()
            if ext == '.jpg' or ext == '.jpeg':
                img_format = 'JPEG'
            elif ext == '.png':
                img_format = 'PNG'
            else:
                raise ValueError("Unsupported image format")
            
            img.save(buffer, format=img_format)
            image_bytes = buffer.getvalue()
            model = genai.GenerativeModel("gemini-pro-vision")
            response = model.generate_content(glm.Content(parts=[glm.Part(text='The Images is a banking form. From the form, return a json which will contain the form value asked along with an example for it.Replace spaces with _ . For example, the form has a option of first name , account number, last name ,phone number. It should a json like {'first_name':'John','account_number':42132123,'last_name':'Doe','phone_number':9192939472}]. Remember that this is just an example and if you encounter with this example, dont limit yourself to generate the above json. If you do not encounter any of the json example pairs, use your own understanding and logic to create the json. '), glm.Part(inline_data=glm.Blob(mime_type='image/jpeg', data=image_bytes))]))
            result = response.text
            json_objects = re.findall(r'{.*?}', result, re.DOTALL)
            json_data = [json.loads(obj) for obj in json_objects]
            all_json_data.extend(json_data)
    return all_json_data

@app.get("/images")
def list_images():
    try:
        files = os.listdir(IMAGE_DIR)
        image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
        return {"images": image_files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-ocr")
async def process_ocr(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_path = os.path.join(CAPTURE_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        
        response = capture(file_path)
        return {'message':f"{response}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
