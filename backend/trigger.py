# pip install fastapi python-dotenv uvicorn
# uvicorn backend.main:app --reload

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import asyncio

# Load environment variables from .env file
load_dotenv()

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

# Placeholder for the pipeline function
async def pipeline_function(websocket: WebSocket):
    try:
        for image_file in os.listdir(image_directory):
            if image_file.lower().endswith(".jpg") or image_file.lower().endswith(".jpeg"):
                image_path = os.path.join(image_directory, image_file)
                image_bytes = image_to_bytes(image_path)

                # Send to client
                await websocket.send_bytes(image_bytes)

                # Simulate processing time, obv wont need once we using an actual pipeline work
                await asyncio.sleep(4)  # Simulate some processing time

        await websocket.send_text("Pipeline processing completed.")
    except Exception as e:
        await websocket.send_text(f"Error: {e}")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("Hello From Connection")
    await websocket.accept()
    try:
        await pipeline_function(websocket)
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.close(code=1001)
        print(f"Error: {e}")

