from fastapi import FastAPI, File, UploadFile, HTTPException
from google.cloud import storage
from google.auth.exceptions import DefaultCredentialsError
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# /help endpoint
@app.get("/help")
async def read_root():
    return {"message": "Hello, World!"}

# /upload endpoint
@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Initialize a client
        storage_client = storage.Client()

        # Define the bucket name and destination blob name
        bucket_name = "scribe-main"
        destination_blob_name = file.filename

        # Create a bucket object
        bucket = storage_client.bucket(bucket_name)

        # Create a blob object from the bucket
        blob = bucket.blob(destination_blob_name)

        # Upload the file to GCS
        blob.upload_from_file(file.file, content_type=file.content_type)

        return {"message": f"File {file.filename} uploaded to {bucket_name}."}

    except DefaultCredentialsError:
        raise HTTPException(status_code=500, detail="Google Cloud credentials not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/initPipeline")
async def init_pipeline(file: UploadFile = File(...)):
    try:
        pass
    finally:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
