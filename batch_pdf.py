from PIL import Image
import os

def convertBatchToPDF(directory, output_pdf_path, width=None, height=None):
    """
    Converts all images in a directory into a single PDF.
    """

    image_files = [f for f in os.listdir(directory) if f.lower().endswith('.jpg') or f.lower().endswith('.jpeg')]
    
    if not image_files:
        raise ValueError("No JPEG files found in the directory.")

    image_files.sort()

    first_image_path = os.path.join(directory, image_files[0])
    first_image = Image.open(first_image_path).convert("RGB")

    if width is not None and height is not None:
        first_image = first_image.resize((width, height))

    images = []
    for f in image_files[1:]:
        try:
            img = Image.open(os.path.join(directory, f)).convert("RGB")
            if width is not None and height is not None:
                img = img.resize((width, height))
            images.append(img)
        except Exception as e:
            print(f"Error processing file {f}: {e}")

    first_image.save(output_pdf_path, save_all=True, append_images=images)

    return output_pdf_path
