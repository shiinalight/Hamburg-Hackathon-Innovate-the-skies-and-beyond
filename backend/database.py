import sqlite3

def get_db_connection():
    """
    Creates a connection to the SQLite database.
    'check_same_thread=False' allows FastAPI's asynchronous 
    requests to access the connection safely.
    """
    conn = sqlite3.connect('skyshare.db', check_same_thread=False)
    # This allows us to access columns by name (e.g., row['name']) 
    # instead of just index (e.g., row[1])
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Initializes the database schema. 
    Run this once at the start of your project or via the Nix shell hook.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Flights Table: Tracks airline 'Ground Truth'
    # We use flight_no as the primary key to avoid duplicate flight entries.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flights (
            flight_no TEXT PRIMARY KEY,
            scheduled_arrival TEXT,
            estimated_arrival TEXT,
            status TEXT,  -- e.g., 'On Time', 'Delayed', 'Landed'
            last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Shuttles Table: The 'Rooms' people join
    # Stores destination and social preferences for the group.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shuttles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destination TEXT NOT NULL,
            creator_id TEXT NOT NULL,
            max_capacity INTEGER DEFAULT 4,
            vibe_restriction TEXT,  -- e.g., 'Business Only', 'Chatty'
            status TEXT DEFAULT 'open'
        )
    ''')

    # 3. Users Table: Tracks individual travelers
    # Links a user to their flight and their chosen shuttle.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            flight_no TEXT,
            shuttle_id INTEGER,
            preferences TEXT,
            FOREIGN KEY (flight_no) REFERENCES flights (flight_no),
            FOREIGN KEY (shuttle_id) REFERENCES shuttles (id)
        )
    ''')

    conn.commit()
    conn.close()
    print("🚀 SQLite Database and Tables Initialized Successfully.")

if __name__ == "__main__":
    init_db()