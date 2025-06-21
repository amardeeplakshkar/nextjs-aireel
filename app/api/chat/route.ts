import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    const { prompt, system } = await req.json();
    const result = await generateText({
        model: openai('openai'),
        system: system,
        prompt: prompt,
    });

    const lines = result.text.split('\n').filter(line => line.trim() !== '');
    return NextResponse.json(lines)
}
