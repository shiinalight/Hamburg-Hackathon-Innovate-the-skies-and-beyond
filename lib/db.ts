import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbCache: Database | null = null;

export async function getDb() {
  if (dbCache) return dbCache;

  const dbPath = path.resolve(process.cwd(), 'matchy.sqlite');

  dbCache = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Initialize Schema
  await dbCache.exec(`
    CREATE TABLE IF NOT EXISTS flights (
      flight_no TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shuttles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      host TEXT NOT NULL,
      title TEXT NOT NULL,
      flight TEXT,
      capacity INTEGER NOT NULL,
      occupied INTEGER DEFAULT 1,
      dest TEXT NOT NULL,
      time TEXT NOT NULL,
      lang TEXT NOT NULL,
      transport TEXT NOT NULL,
      badge TEXT,
      avatar TEXT NOT NULL,
      budget TEXT
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shuttle_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT,
      avatar TEXT NOT NULL,
      FOREIGN KEY (shuttle_id) REFERENCES shuttles (id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      text TEXT NOT NULL,
      sent INTEGER NOT NULL,
      time TEXT NOT NULL
    );
  `);

  // Seed initial data if empty
  const count = await dbCache.get('SELECT COUNT(*) as count FROM shuttles');
  if (count && count.count === 0) {
    await dbCache.exec(`
      INSERT INTO flights (flight_no, status) VALUES 
      ('LH2024', 'On Time'), 
      ('UA123', 'Delayed'), 
      ('BA456', 'On Time');

      INSERT INTO shuttles (host, title, flight, capacity, occupied, dest, time, lang, transport, badge, avatar, budget)
      VALUES 
      ('Sophie R.', 'Sophie''s Shuttle', 'LH2024', 4, 3, 'Alexanderplatz', '15:45', 'English', 'Taxi', 'Standard Host', 'https://randomuser.me/api/portraits/women/44.jpg', '$15'),
      ('Liam K.', 'Liam''s XL Shuttle', 'UA123', 6, 2, 'Potsdamer Platz', '16:00', 'English', 'Ride-share', 'Pro Host', 'https://randomuser.me/api/portraits/men/32.jpg', '$22'),
      ('Aisha B.', 'Aisha''s Green Shuttle', 'BA456', 4, 1, 'Alexanderplatz', '15:30', 'German', 'Public Transit', 'Eco-Friendly', 'https://randomuser.me/api/portraits/women/68.jpg', '$8');
      
      INSERT INTO members (shuttle_id, name, role, status, avatar)
      VALUES 
      (1, 'Sophie R.', 'Host', 'Active', 'https://randomuser.me/api/portraits/women/44.jpg'),
      (2, 'Liam K.', 'Host', 'Active', 'https://randomuser.me/api/portraits/men/32.jpg'),
      (3, 'Aisha B.', 'Host', 'Active', 'https://randomuser.me/api/portraits/women/68.jpg');
    `);
  }

  return dbCache;
}
