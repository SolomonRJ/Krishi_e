from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from utils.fertilizer_info import fertilizer_dic
import os

router = APIRouter()

CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data/fertilizer.csv")

class FertilizerInput(BaseModel):
    crop: str
    nitrogen: int
    phosphorus: int
    potassium: int

@router.post("/recommend-fertilizer")
def recommend_fertilizer(data: FertilizerInput):
    if not os.path.exists(CSV_PATH):
        raise HTTPException(status_code=500, detail="Fertilizer data not found.")
    
    try:
        df = pd.read_csv(CSV_PATH)
        
        # Case insensitive match
        crop_data = df[df['Crop'].str.lower() == data.crop.lower()]
        if crop_data.empty:
             raise HTTPException(status_code=404, detail=f"Crop '{data.crop}' not found in database. Please check the spelling.")
             
        mr = crop_data.iloc[0]
        nr = mr['N']
        pr = mr['P']
        kr = mr['K']
        
        n_diff = nr - data.nitrogen
        p_diff = pr - data.phosphorus
        k_diff = kr - data.potassium
        
        abs_diffs = {abs(n_diff): "N", abs(p_diff): "P", abs(k_diff): "K"}
        max_diff = max(abs_diffs.keys())
        nutrient = abs_diffs[max_diff]
        
        key = ""
        if nutrient == "N":
            key = 'NHigh' if n_diff < 0 else 'Nlow'
        elif nutrient == "P":
            key = 'PHigh' if p_diff < 0 else 'Plow'
        else:
            key = 'KHigh' if k_diff < 0 else 'Klow'
            
        recommendation = fertilizer_dic.get(key, "No recommendation available.")
        
        return {
            "recommendation": recommendation,
            "analysis": {
                "nutrient_focus": nutrient,
                "status": "High" if ((nutrient=="N" and n_diff<0) or (nutrient=="P" and p_diff<0) or (nutrient=="K" and k_diff<0)) else "Low"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
