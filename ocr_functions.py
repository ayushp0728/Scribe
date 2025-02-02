import cv2
import pytesseract
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def ocr_func(img):
    extracted_text = pytesseract.image_to_string(img)  # Runs OCR on the image
    return extracted_text.strip()

def preprocess_img1(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1] 
    img = cv2.medianBlur(img, 5)  
    return img

def preprocess_img(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY, 11, 2) 
    kernel = np.ones((1, 1), np.uint8)
    gray = cv2.dilate(gray, kernel, iterations=1) 
    gray = cv2.erode(gray, kernel, iterations=1)
    return gray

if __name__ == "__main__":
    img_path = "ImagesForTesting/ocr_14.jpg"  
    img = cv2.imread(img_path)



    if img is None:
        print(f"Error: no {img_path}")
    else:
        #Preprocess image
        img = preprocess_img(img)  
        text = ocr_func(img) 
        print("\n🔹 Extracted Text:\n", text)


