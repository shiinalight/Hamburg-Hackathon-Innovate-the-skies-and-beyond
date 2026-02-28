import json
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# AI & Database Imports
import vertexai
from vertexai.generative_models import GenerativeModel
from database import get_db_connection, init_db

app = FastAPI()

# 1. SETUP: CORS & AI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize GCP Vertex AI (Replace with your project ID)
# vertexai.init(project="20260228-hackathon", location="us-central1")

# 2. SCHEMAS (Pydantic models for React ↔ API communication)
class UserJoin(BaseModel):
    user_id: str
    name: str
    flight_no: str
    preferences: str

class ShuttleCreate(BaseModel):
    destination: str
    creator_id: str
    max_capacity: int = 4
    vibe_restriction: Optional[str] = "None"

# 3. BACKGROUND TASKS
def sync_flight_with_lufthansa(flight_no: str):
    """
    Simulates fetching real-time data from Lufthansa.
    In a real scenario, use: requests.get(LUFTHANSA_API_URL)
    """
    conn = get_db_connection()
    # Mocking a response
    mock_eta = "2024-05-20 18:45"
    mock_status = "Delayed"
    
    conn.execute("""
        INSERT OR REPLACE INTO flights (flight_no, estimated_arrival, status, last_sync)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    """, (flight_no, mock_eta, mock_status))
    conn.commit()
    conn.close()

# 4. ROUTES
@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def health_check():
    return {"status": "SkyShare API Online", "version": "1.0.0"}

@app.post("/users/join")
async def join_app(user: UserJoin, background_tasks: BackgroundTasks):
    conn = get_db_connection()
    try:
        # Save user
        conn.execute(
            "INSERT OR REPLACE INTO users (id, name, flight_no, preferences) VALUES (?, ?, ?, ?)",
            (user.user_id, user.name, user.flight_no, user.preferences)
        )
        conn.commit()
        # Update flight data in the background
        background_tasks.add_task(sync_flight_with_lufthansa, user.flight_no)
        return {"message": f"Welcome {user.name}, checking flight {user.flight_no}..."}
    finally:
        conn.close()

@app.post("/shuttles/create")
async def create_shuttle(shuttle: ShuttleCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO shuttles (destination, creator_id, max_capacity, vibe_restriction) VALUES (?, ?, ?, ?)",
        (shuttle.destination, shuttle.creator_id, shuttle.max_capacity, shuttle.vibe_restriction)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"shuttle_id": new_id, "status": "created"}

@app.get("/recommendations/{user_id}")
async def get_shuttle_recommendations(user_id: str):
    conn = get_db_connection()
    # Fetch User & Flight context
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch all available Shuttles
    shuttles = conn.execute("SELECT * FROM shuttles WHERE status = 'open'").fetchall()
    shuttle_list = [dict(s) for s in shuttles]

    if not shuttle_list:
        return {"matches": [], "message": "No active shuttles found."}

    # AI MATCHING (Gemini)
    # Note: Wrap in try/except if AI credentials aren't set up yet
    try:
        model = GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        User Profile: {dict(user)}
        Available Shuttles: {json.dumps(shuttle_list)}
        
        Task: Rank these shuttles for the user. 
        Return ONLY a JSON list of objects: [{{"shuttle_id": 1, "score": 95, "reason": "short explanation"}}]
        """
        response = model.generate_content(prompt)
        # Clean response text if model includes markdown code blocks
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        matches = json.loads(clean_json)
        return {"matches": matches}
    except Exception as e:
        # Fallback: Return raw list if AI fails
        return {"matches": shuttle_list, "error": "AI ranking unavailable", "details": str(e)}
    finally:
        conn.close()

async def sync_flight_data(flight_no: str):
    conn = get_db_connection()
    # 1. Call Lufthansa API (Pseudo-code)
    # data = call_lufthansa_api(flight_no)
    
    # 2. Update the Flights DB
    conn.execute("""
        UPDATE flights 
        SET estimated_arrival = ?, status = ?, last_sync = CURRENT_TIMESTAMP 
        WHERE flight_no = ?
    """, (data['eta'], data['status'], flight_no))
    conn.commit()

@app.get("/users", response_model=List[dict])
async def get_all_users():
    conn = get_db_connection()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return [dict(u) for u in users]

@app.get("/shuttles", response_model=List[dict])
async def get_all_shuttles():
    conn = get_db_connection()
    # Joining with users to show the creator's name if needed
    shuttles = conn.execute("""
        SELECT s.*, u.name as creator_name 
        FROM shuttles s 
        LEFT JOIN users u ON s.creator_id = u.id
    """).fetchall()
    conn.close()
    return [dict(s) for s in shuttles]

@app.get("/shuttles/available")
async def get_shuttles(flight_no: str, background_tasks: BackgroundTasks):
    # Trigger a sync in the background so the user doesn't wait for the API call
    background_tasks.add_task(sync_flight_data, flight_no)
    
    # Return current shuttles from SQLite
    conn = get_db_connection()
    return conn.execute("SELECT * FROM shuttles WHERE status = 'open'").fetchall()

@app.get("/flights", response_model=List[dict])
async def get_all_flights():
    conn = get_db_connection()
    flights = conn.execute("SELECT * FROM flights").fetchall()
    conn.close()
    return [dict(f) for f in flights]

@app.get("/shuttles/{shuttle_id}/members")
async def get_shuttle_members(shuttle_id: int):
    conn = get_db_connection()
    members = conn.execute(
        "SELECT id, name, preferences FROM users WHERE shuttle_id = ?", 
        (shuttle_id,)
    ).fetchall()
    conn.close()
    return [dict(m) for m in members]