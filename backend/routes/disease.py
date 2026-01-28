from fastapi import APIRouter, UploadFile, File, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import json
from utils.disease_info import disease_dic

router = APIRouter()

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models/final_disease_prediction.h5")
CLASS_INDICES_PATH = os.path.join(BASE_DIR, "models/class_indices.json")

# Global variables
model = None
class_names = {}

# Load Model & Class Indices
if os.path.exists(MODEL_PATH) and os.path.exists(CLASS_INDICES_PATH):
    try:
        # Load Model
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Disease prediction model loaded successfully (H5).")

        # Load Class Indices
        with open(CLASS_INDICES_PATH, 'r') as f:
            indices = json.load(f)
            # Create index -> class_name mapping
            class_names = {v: k for k, v in indices.items()}
        print("Class indices loaded successfully.")

    except Exception as e:
        print(f"Error loading model or class indices: {e}")
        model = None
else:
    print(f"Warning: Model or Class Indices not found. Checked: {MODEL_PATH}, {CLASS_INDICES_PATH}")

def transform_image(image_bytes):
    # Open image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Ensure RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize to 224x224 (Standard for most models like ResNet/MobileNet)
    image = image.resize((224, 224))
    
    # Convert to numpy array
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    
    # Expand dimensions (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    # Normalize (Assuming 0-1 range)
    img_array = img_array / 255.0
    
    return img_array

@router.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Disease model is not loaded.")
    
    try:
        content = await file.read()
        processed_image = transform_image(content)
        
        predictions = model.predict(processed_image)
        
        # Get the predicted class index
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions)) * 100
        
        predicted_class_name = class_names.get(predicted_index, "Unknown")
        
        # Parse result
        parts = predicted_class_name.split("___")
        crop_name = parts[0]
        disease_name = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        
        description = disease_dic.get(predicted_class_name, "No description available.")
        
        return {
            "crop": crop_name,
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "recommendation": description
        }
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))
