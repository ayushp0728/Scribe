# Function for batch converting JPEG images to a single PDF file using the Pillow library

# pip install pillow
from PIL import Image
import os

def convertBatchToPDF(directory, width=None, height=None):
    # Get all JPEG files in the directory
    image_files = [f for f in os.listdir(directory) if f.lower().endswith('.jpg') or f.lower().endswith('.jpeg')]
    
    # Ensure there are JPEG files in the directory
    if not image_files:
        raise ValueError("No JPEG files found in the directory.")
    
    # Sort image files to maintain order
    image_files.sort()

    # Print the list of files for debugging
    print(f"Image files: {image_files}")

    # Open the first image, resize if required, and convert it to RGB mode
    first_image_path = os.path.join(directory, image_files[0])
    first_image = Image.open(first_image_path).convert("RGB")
    if width is not None and height is not None:
        first_image = first_image.resize((width, height))
    
    # Open the remaining images, resize if required, and convert them to RGB mode
    images = []
    for f in image_files[1:]:
        try:
            img = Image.open(os.path.join(directory, f)).convert("RGB")
            if width is not None and height is not None:
                img = img.resize((width, height))
            images.append(img)
        except Exception as e:
            print(f"Error processing file {f}: {e}")
    
    # Save all images into a single PDF file
    pdf_path = os.path.join(directory, "output.pdf")
    first_image.save(pdf_path, save_all=True, append_images=images)

    return pdf_path


# Example usage
directory = "C:\\Users\\laugh\\OneDrive\\Desktop\\Scribe\\backend\pics"
pdf_path = convertBatchToPDF(directory)
print(f"PDF saved at: {pdf_path}")
