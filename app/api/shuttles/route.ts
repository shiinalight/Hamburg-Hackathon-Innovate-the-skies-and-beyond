import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDb();
        const shuttles = await db.all(`
            SELECT s.*, f.status as flightStatus, f.last_updated as flight_last_updated 
            FROM shuttles s
            LEFT JOIN flights f ON s.flight = f.flight_no
        `);
        return NextResponse.json(shuttles);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch shuttles" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const db = await getDb();
        const body = await req.json();
        const { host, title, flight, capacity, occupied, dest, time, lang, transport, badge, avatar, budget } = body;

        // Ensure the flight exists in the flights table (mocking real-time creation)
        if (flight) {
            await db.run(
                `INSERT OR IGNORE INTO flights (flight_no, status) VALUES (?, ?)`,
                [flight, "On Time"] // Default newly entered flights to 'On Time'
            );
        }

        const result = await db.run(
            `INSERT INTO shuttles (host, title, flight, capacity, occupied, dest, time, lang, transport, badge, avatar, budget) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [host, title, flight || null, capacity || 4, occupied || 1, dest, time || "Now", lang, transport, badge || "New Request", avatar, budget || ""]
        );

        const newShuttleId = result.lastID;

        // Also add the host to members
        await db.run(
            `INSERT INTO members (shuttle_id, name, role, avatar) VALUES (?, ?, ?, ?)`,
            [newShuttleId, host, "Host", avatar]
        );

        return NextResponse.json({ id: newShuttleId, message: "Shuttle created successfully" });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create shuttle" }, { status: 500 });
    }
}
