import os
import sys
import asyncio
import base64
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from loguru import logger

# Load environment variables from .env file
load_dotenv()

# Set up logging with loguru
logger.remove()  # Remove the default logger
logger.add(sys.stdout, level="DEBUG", format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}")

app = FastAPI()

origins = ["*"]  # Allow all origins, you can restrict this to specific origins if needed

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the path to your image directory here
image_directory = "/Users/ayushpatel/Desktop/Scribe/backend/pics"

# Function to convert images to base64
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')  # Encode to base64 string

# Placeholder for the pipeline function
async def pipeline_function(websocket: WebSocket):
    try:
        for image_file in os.listdir(image_directory):
            if image_file.lower().endswith(".jpg") or image_file.lower().endswith(".jpeg"):
                image_path = os.path.join(image_directory, image_file)
                logger.debug(f"Processing image: {image_path}")
                
                # Convert image to base64
                base64_image = image_to_base64(image_path)
                
                # Create a text message (you can customize it for each image)
                message = f"Here is image {image_file}, processed successfully."

                # Create JSON object with image data and message
                data = {
                    "image": base64_image,
                    "message": message
                }
                
                # Send JSON object to client
                await websocket.send_json(data)
                logger.debug(f"Sent image and message for: {image_path}")
                
                # Simulate processing time (for testing purposes)
                await asyncio.sleep(4)  # Simulate some processing time

        await websocket.send_text("Pipeline processing completed.")
    except Exception as e:
        logger.error(f"Error in pipeline_function: {e}")
        await websocket.send_text(f"An error occurred during processing. Please try again later.")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, doc_id: str = Query(...)):
    logger.info("New WebSocket connection")
    print(f"DocId == {doc_id}")
    await websocket.accept()
    try:
        await pipeline_function(websocket)
    except WebSocketDisconnect:
        logger.warning("Client disconnected")
    except Exception as e:
        logger.error(f"Error in websocket_endpoint: {e}")
        await websocket.close(code=1001)
        logger.error(f"Closing connection due to error: {e}")

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Ensure correct host and port
