import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const db = await getDb();
        const { id } = await params;
        const shuttleId = parseInt(id);

        const shuttle = await db.get('SELECT * FROM shuttles WHERE id = ?', [shuttleId]);
        if (!shuttle) {
            return NextResponse.json({ error: "Shuttle not found" }, { status: 404 });
        }

        const members = await db.all('SELECT * FROM members WHERE shuttle_id = ?', [shuttleId]);

        return NextResponse.json({ ...shuttle, members });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch shuttle details" }, { status: 500 });
    }
}
