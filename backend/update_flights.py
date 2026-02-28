import sqlite3
import requests
import os
from datetime import datetime
from database import get_db_connection

# Configuration
LUFTHANSA_CLIENT_ID = os.environ.get("LUFTHANSA_CLIENT_ID")
LUFTHANSA_CLIENT_SECRET = os.environ.get("LUFTHANSA_CLIENT_SECRET")

def get_access_token():
    # Ideally first test the token?
    """Lufthansa uses OAuth2. You need a bearer token for every request."""
    url = "https://api.lufthansa.com/v1/oauth/token"
    data = {
        "client_id": LUFTHANSA_CLIENT_ID,
        "client_secret": LUFTHANSA_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, data=data)
    token = response.json().get("access_token")
    # token = os.environ.get("LUFTHANSA_TOKEN")
    return token

def update_active_flights():
    conn = get_db_connection()
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    
    # 1. Get unique flight numbers that have users
    active_flights = conn.execute("SELECT DISTINCT flight_no FROM users").fetchall()
    print("active flights:", active_flights)
    
    for row in active_flights:
        flight_no = row['flight_no']
        date = datetime.now().strftime("%Y-%m-%d")
        
        # 2. Call Lufthansa Flight Status API
        api_url = f"https://api.lufthansa.com/v1/operations/flightstatus/{flight_no}/{date}"
        res = requests.get(api_url, headers=headers)

        if res.status_code == 200:
            data = res.json()
            flight_data = data['FlightStatusResource']['Flights']['Flight'][0]
            # Navigate the specific Lufthansa JSON structure
            arrival_info = flight_data['Arrival']
            eta = arrival_info.get('EstimatedTimeLocal', {}).get('DateTime', 'N/A')
            status_code = arrival_info.get('TimeStatus', {}).get('Code', 'OT') # OT = On Time

            # 3. Update the database
            conn.execute("""
                INSERT OR REPLACE INTO flights (flight_no, estimated_arrival, status, last_sync)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            """, (flight_no, eta, status_code))
            print(f"Updated {flight_no}: {status_code} at {eta}")
        else:
            print(f"Failed to sync {flight_no}: {res.status_code}")

    conn.commit()
    conn.close()

def cleanup_stale_shuttles():
    """
    Closes shuttles where the flight has already landed 
    or the window has passed.
    """
    conn = get_db_connection()
    # Close shuttles where the flight landed more than 2 hours ago
    conn.execute("""
        UPDATE shuttles 
        SET status = 'closed' 
        WHERE id IN (
            SELECT s.id FROM shuttles s
            JOIN users u ON s.creator_id = u.id
            JOIN flights f ON u.flight_no = f.flight_no
            WHERE f.estimated_arrival < datetime('now', '-2 hours')
        )
    """)
    conn.commit()
    conn.close()

def check_for_disruptions():
    """
    Identifies shuttles where a flight delay might 
    break the group compatibility.
    """
    conn = get_db_connection()
    # Find shuttles where members are now landing > 60 mins apart
    # This is a bit complex for SQL, so we'll just flag 'Delayed' flights
    conn.execute("""
        UPDATE shuttles 
        SET status = 'review_required'
        WHERE id IN (
            SELECT DISTINCT s.id FROM shuttles s
            JOIN users u ON s.id = u.shuttle_id
            JOIN flights f ON u.flight_no = f.flight_no
            WHERE f.status = 'Delayed'
        )
    """)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_active_flights()
    cleanup_stale_shuttles()
    check_for_disruptions()

