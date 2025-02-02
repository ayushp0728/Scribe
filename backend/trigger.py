# pip install fastapi python-dotenv uvicorn
# uvicorn backend.main:app --reload

import base64
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import asyncio
import json

# Load environment variables from .env file
load_dotenv()

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

# Function to convert images to bytes
def image_to_bytes(image_path):
    with open(image_path, "rb") as image_file:
        return image_file.read()

# Function to convert images to base64 string
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Placeholder for the pipeline function
async def pipeline_function(websocket: WebSocket):
    try:
        for image_file in os.listdir(image_directory):
            if image_file.lower().endswith(".jpg") or image_file.lower().endswith(".jpeg"):
                image_path = os.path.join(image_directory, image_file)
                logger.debug(f"Processing image: {image_path}")
                image_base64 = image_to_base64(image_path)

                # Example JSON data
                json_data = {
                    "image_data": image_base64,
                    "summary": f"This is a summary of the image, {image_file}"
                }

                # Send JSON data to client
                await websocket.send_text(json.dumps(json_data))
                logger.debug(f"Sent image and JSON data: {image_path}")

                # Simulate processing time, obviously won't need once we use actual pipeline work
                await asyncio.sleep(4)  # Simulate some processing time        await websocket.send_text("Pipeline processing completed.")
    except Exception as e:
        logger.error(f"Error in pipeline_function: {e}")
        await websocket.send_text(f"Error: {e}")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("New WebSocket connection")
    await websocket.accept()
    try:
        await pipeline_function(websocket)
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
