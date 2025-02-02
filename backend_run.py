# pip install fastapi python-dotenv uvicorn
# uvicorn backend.main:app --reload

import base64
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import asyncio
import json
import time
import cv2
import shutil
import pytesseract
import numpy as np
from ollama_run import send_request_to_ollama
from ocr_functions import ocr_func, preprocess_img
from google.cloud import storage
from google.auth.exceptions import DefaultCredentialsError
from batch_pdf import convertBatchToPDF  # Import batch function
from arduino_call import runarduino

from toc_pipeline_trial import generate_toc_label

# Define directories
TEMP_IMG_DIR = "TemporaryImages"
PDF_OUTPUT_DIR = "GeneratedPDFs"

# Replace 'path/to/your/json/file.json' with the actual path to your JSON file
credentials_path = 'C:\\Users\\amrik\\Downloads\\scribe-449619-df53ab884c24.json'

# Replace 'GCP_CREDENTIALS_PATH' with the desired name for the environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

origins = ["*"]  # Allow all origins, you can restrict this to specific origins if needed

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the path to your image directory or pipeline process here
image_directory = "C:\\Users\\laugh\\OneDrive\\Desktop\\Scribe\\backend\\pics"

def upload_to_gcs(file_path, bucket_name, subfolder):
    """
    Uploads a file to Google Cloud Storage.
    
    Args:
        file_path (str): The path to the file to be uploaded.
        bucket_name (str): The name of the GCS bucket.
    
    Returns:
        str: A message indicating the result of the upload.
    """
    try:
        # Initialize a client
        storage_client = storage.Client()

        # Define the destination blob name including subfolder
        destination_blob_name = f"{subfolder}/book.pdf"

        # Create a bucket object
        bucket = storage_client.bucket(bucket_name)

        # Create a blob object from the bucket
        blob = bucket.blob(destination_blob_name)

        # Upload the file to GCS
        blob.upload_from_filename(file_path)

        return f"File {destination_blob_name} uploaded to {bucket_name}."

    except DefaultCredentialsError:
        return "Google Cloud credentials not found."
    except Exception as e:
        return f"Error uploading file: {e}"

# Function to convert images to bytes
def image_to_bytes(image_path):
    with open(image_path, "rb") as image_file:
        return image_file.read()

# Function to convert images to base64 string
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

async def text_page_pipeline(websocket: WebSocket, list_of_summaries, page_num = 1):
    """
    Captures a page, processes it for OCR, saves the image in 'TemporaryImages',
    and sends the summarized text via WebSocket.
    """


    # Ensure directories exist
    os.makedirs(TEMP_IMG_DIR, exist_ok=True)
    os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)  

    # Initialize Tesseract
    try:
        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    except Exception as e:
        print(f"❌ Error: Could not set Tesseract path. {e}")
        return

    # Initialize Webcam
    try:
        cap = cv2.VideoCapture(0)
        time.sleep(2)

        # Set camera resolution
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
        cap.set(cv2.CAP_PROP_FPS, 30)

        if not cap.isOpened():
            raise RuntimeError("Could not open webcam.")

    except Exception as e:
        print(f"❌ Error: Failed to initialize webcam. {e}")
        return

    print("Press 'Q' to capture and process the image -->")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                raise RuntimeError("Failed to capture image from webcam.")

            cv2.imshow("Webcam - Press Q to Capture", frame)

            frame = None
            for _ in range(10):  
                ret, frame = cap.read()
                if not ret:
                    print("❌ Error: Failed to capture image from webcam.")
                    return None
                time.sleep(0.1)

            processed_frame = preprocess_img(frame)
            processed_frame = cv2.rotate(processed_frame, cv2.ROTATE_90_CLOCKWISE)

            # Save the processed image to TemporaryImages
            img_path = os.path.join(TEMP_IMG_DIR, f"page_{page_num}.jpg")
            cv2.imwrite(img_path, processed_frame)
            
            # Convert to Base64
            processed_frame_64 = image_to_base64(img_path)

            break

    except Exception as e:
        print(f"Error: Webcam capture failed. {e}")
        cap.release()
        cv2.destroyAllWindows()
        return

    cap.release()
    cv2.destroyAllWindows()

    '''
    
    
    THIS IS WHERE THE ARM WILL MOVE VIA USB
    
    
    
    '''
    runarduino()

    # ✅ Run OCR Processing
    try:
        extracted_text = ocr_func(processed_frame)
    except Exception as e:
        print(f"❌ Error: OCR processing failed. {e}")
        return

    # ✅ Summarization using Ollama
    try:
        summary = send_request_to_ollama(extracted_text, model_name="deepseek-r1:1.5b")

        # ✅ Create JSON Response
        json_data = {
            "status": "continuing",
            "image_data": processed_frame_64,
            "summary": summary
        }

        print("THIS IS JSON DATA:", json_data)

        await websocket.send_text(json.dumps(json_data))
        list_of_summaries.append(summary)
        print(f"✅ Sent image & summary for Page {page_num}.")

    except Exception as e:
        print(f"❌ Error: Ollama request failed. {e}")
        return


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, doc_id: str = Query(...)):
    logger.info("New WebSocket connection")
    await websocket.accept()

    list_of_summaries = []


    try:
        for i in range(1, 2+2):
            await text_page_pipeline(websocket, list_of_summaries)

        # Iterate to generate TOC for the list of summaries
        # Send a final websocket message for the TOC
        toc = []

        for i in range(len(list_of_summaries)):
            short_title = generate_toc_label(list_of_summaries[i])
            toc.append(short_title)

        # Create JSON Response
        json_data = {
            "status": "ended",
            "table_of_content": toc
        }

        print("THIS IS TOC JSON:", json_data)

        await websocket.send_text(json.dumps(json_data))

        # Convert TemporaryImages to a single PDF
        print("📄 Converting scanned pages into a PDF...")
        pdf_path = os.path.join(PDF_OUTPUT_DIR, "scanned_document.pdf")
        convertBatchToPDF(TEMP_IMG_DIR, pdf_path)

        print("DOC_ID", doc_id)
        upload_to_gcs("C:\\Users\\amrik\\HackRU2\\GeneratedPDFs\\scanned_document.pdf", "scribe-main-bucket", doc_id)

    except WebSocketDisconnect:
        logger.warning("Client disconnected")
    except Exception as e:
        logger.error(f"Error in websocket_endpoint: {e}")
        await websocket.close(code=1001)
        print(f"Error: {e}")

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
