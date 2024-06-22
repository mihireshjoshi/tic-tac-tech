# app.py
from fastapi import FastAPI, File, UploadFile
from typing import List
import shutil

app = FastAPI()

@app.post("/scan")
async def scan_images(files: List[UploadFile] = File(...)):
    for file in files:
        with open(f"uploaded_{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    return {"message": f"Received {len(files)} images successfully."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
