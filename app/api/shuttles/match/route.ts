import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { prefs, shuttles } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        const prompt = `
    You are the matching engine for "Matchy", a shuttle-sharing app.
    Return ALL relevant shuttles (ranked by compatibility) as a JSON array of objects with {id, similarity, reason}.
    
    User Preferences:
    - Destination: ${prefs.dest}
    - Flight Number: ${prefs.flight || 'Not specified'}
    - Language: ${prefs.lang}
    - Transport: ${prefs.transport}
    - Seat Capacity Needed: ${prefs.capacity}

    Available Shuttles:
    ${JSON.stringify(shuttles)}

    CRITIERIA:
    1. Flight Number match is absolute highest priority.
    2. Destination match is high priority.
    3. MUST have space.
    
    Return ONLY the JSON array.
    `;

        const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];
        let result;
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(prompt);
                if (result) break;
            } catch (err) {
                console.warn(`Model ${modelName} failed, trying next...`, err);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All models failed");
        }

        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if AI returns them
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const matches = JSON.parse(text);

        return NextResponse.json(matches);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to match shuttles" }, { status: 500 });
    }
}
