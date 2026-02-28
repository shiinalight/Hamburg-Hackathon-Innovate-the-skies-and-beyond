import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDb();
        const shuttles = await db.all('SELECT * FROM shuttles');
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
        const { host, title, capacity, occupied, dest, time, lang, transport, badge, avatar, budget } = body;

        const result = await db.run(
            `INSERT INTO shuttles (host, title, capacity, occupied, dest, time, lang, transport, badge, avatar, budget) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [host, title, capacity || 4, occupied || 1, dest, time || "Now", lang, transport, badge || "New Request", avatar, budget || ""]
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
