import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

const client = await Client.connect(process.env.CLIENT_TTS!);

export async function POST(req: NextRequest) {
    const { line, voice, emotion } = await req.json();
    const result = await client.predict("/text_to_speech_app", { 
        prompt: line.replace("Munna Bhai:", "").replace("Circuit:", ""), 		
        voice: voice, 		
        emotion: emotion, 		
        use_random_seed: true, 		
        specific_seed: 3, 
    });
    return NextResponse.json(result)
}