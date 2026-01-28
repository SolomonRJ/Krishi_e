# KrishiAI - Modern Agricultural Intelligence

KrishiAI is a full-stack AI application designed to assist farmers with disease detection, crop recommendation, and fertilizer suggestions.

## 📂 Project Structure

- **backend/**: FastAPI application serving ML models.
  - `routes/`: API endpoints.
  - `models/`: ML models (ResNet9, RandomForest).
  - `utils/`: Helper functions and data dictionaries.
- **frontend/**: Modern React application (Vite).
  - `src/pages/`: UI for different features.
  - `src/components/`: Reusable components.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The backend API will start at `http://localhost:8000`.
Swagger Documentation: `http://localhost:8000/docs`.

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm install axios react-router-dom framer-motion lucide-react
npm run dev
```
The frontend will start at `http://localhost:5173`.

## 🧠 Features

### 🌱 Plant Disease Detection
Upload an image of a plant leaf to detect diseases.
- Supports: Apple, Corn, Grape, Potato, Tomato, and more.
- Model: ResNet9 (PyTorch).

### 🌾 Crop Recommendation
Enter soil and weather conditions to get the best crop recommendation.
- Inputs: N, P, K, Temperature, Humidity, Rainfall.
- Model: Random Forest.

### 🧪 Fertilizer Suggestions
Get advice on fertilizer usage based on soil nutrient levels.
- Inputs: Crop, N, P, K.
- Logic: Rule-based analysis.

## ⚠️ Notes
- Ensure `backend/models/plant_disease_model.pth` and `backend/models/RandomForest.pkl` are present.
- Ensure `backend/data/fertilizer.csv` is present.
