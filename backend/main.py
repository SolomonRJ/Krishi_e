from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import disease, crop, fertilizer
import uvicorn

app = FastAPI(title="KrishiAI API", description="Smart farming assistance API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(disease.router, tags=["Disease Prediction"])
app.include_router(crop.router, tags=["Crop Recommendation"])
app.include_router(fertilizer.router, tags=["Fertilizer Recommendation"])

@app.get("/")
def home():
    return {"message": "KrishiAI Backend is running", "status": "active"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
