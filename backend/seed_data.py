import sqlite3
import random
from database import get_db_connection, init_db

def seed_fake_users():
    conn = get_db_connection()
    
    # # 1. Generate Fake Flights
    flights = [
        ("LH400", "2024-05-20 14:30", "On Time"),
        ("LH402", "2024-05-20 16:15", "Delayed"),
        ("BA981", "2024-05-20 14:45", "On Time")
    ]
    # for f in flights:
    #     conn.execute("""
    #         INSERT OR REPLACE INTO flights (flight_no, estimated_arrival, status)
    #         VALUES (?, ?, ?)
    #     """, f)

    # 1. Generate Fake Users
    names = ["Max", "Sophie", "Lukas", "Emma", "Julian", "Sarah"]
    vibes = [
        "Quiet, business traveler, laptop ready.",
        "Social, happy to chat about tech.",
        "Tired, just want a fast ride to HafenCity.",
        "Looking to split a premium ride to Reeperbahn.",
        "First time in Hamburg, love the harbor and Speicherstadt."
    ]
    
    for i, name in enumerate(names):
        user_id = f"user_{i}"
        flight = random.choice(flights)[0]
        pref = random.choice(vibes)
        conn.execute("""
            INSERT OR REPLACE INTO users (id, name, flight_no, preferences)
            VALUES (?, ?, ?, ?)
        """, (user_id, name, flight, pref))

    # 2. Generate Fake Shuttle Requests
    destinations = ["Reeperbahn", "Speicherstadt", "Jungfernstieg", "HafenCity"]
    for i in range(3):
        conn.execute("""
            INSERT INTO shuttles (destination, creator_id, max_capacity, vibe_restriction)
            VALUES (?, ?, ?, ?)
        """, (random.choice(destinations), f"user_{i}", 4, "None"))

    conn.commit()
    conn.close()
    print("✅ Database seeded with fake flights, users, and shuttles.")

if __name__ == "__main__":
    init_db() # Ensure tables exist
    seed_fake_users()
