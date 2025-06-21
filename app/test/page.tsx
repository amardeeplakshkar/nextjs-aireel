'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Player } from '@remotion/player';
import { MyVideo } from './Video';
import { getAudioDuration } from '../utils/audioUtils';

const Page = () => {
    const [lines, setLines] = useState<string[]>([]);
    const [audios, setAudios] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [videoData, setVideoData] = useState<Array<{
        speaker: 'Munna Bhai' | 'Circuit';
        text: string;
        audioUrl: string;
        durationInFrames: number;
    }>>([]);
    const [showPlayer, setShowPlayer] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
                const chatResponse = await fetch("/api/chat", {
                    method: "POST",
                    body: JSON.stringify({
                        system: SYSTEM_PROMPT_MUNNA_CIRCUIT,
                        prompt: prompt,
                    }),
                });
                const chatLines = await chatResponse.json();
                setLines(chatLines);

                // Generate audio for each line
                const audioPromises = chatLines.map(async (line: string, index: number) => {
                    const { voice } = getSpeakerVoice(line);
                    const isLastLine = index === chatLines.length - 1;
                    const emotion = isLastLine ? 'excited' : getSpeakerEmotion(line).emotion;
                    const audioRes = await fetch("/api/tts", {
                        method: "POST",
                        body: JSON.stringify({
                            line: line.replace("Munna Bhai:", "").replace("Circuit:", ""),
                            voice: voice,
                            emotion: emotion,
                            use_random_seed: true,
                            specific_seed: 3,
                        }),
                    });
                    return audioRes.json();
                });

                const audioResults = await Promise.all(audioPromises);
                setAudios(audioResults);
                
                // Prepare video data with durations
                const videoData = await Promise.all(chatLines.map(async (line: string, index: number) => {
                    const speaker = line.startsWith('Munna Bhai:') ? 'Munna Bhai' : 'Circuit';
                    const audioUrl = audioResults[index].data[0].url || '';
                    const durationInFrames = audioUrl ? await getAudioDuration(audioUrl) : 90; // 3 seconds default
                    
                    return {
                        speaker: speaker as 'Munna Bhai' | 'Circuit',
                        text: line.replace('Munna Bhai:', '').replace('Circuit:', '').trim(),
                        audioUrl: audioUrl,
                        durationInFrames: durationInFrames
                    };
                }));
                
                setVideoData(videoData);
            } catch (err) {
                setError('Failed to load content. Please try again.');
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

    const getSpeakerVoice = (line: string): { speaker: string, voice: string } => {
        if (line.startsWith('Munna Bhai:')) {
            return { speaker: 'Munna Bhai', voice: 'dan' };
        } else if (line.startsWith('Circuit:')) {
            return { speaker: 'Circuit', voice: 'ballad' };
        } else {
            return { speaker: 'Unknown', voice: 'shimmer' };
        }
    };

    const getSpeakerEmotion = (line: string): { speaker: string, emotion: string } => {
        if (line.startsWith('Munna Bhai:')) {
            return { speaker: 'Munna Bhai', emotion: 'confidentaly' };
        } else if (line.startsWith('Circuit:')) {
            return { speaker: 'Circuit', emotion: 'questionary & confused' };
        } else {
            return { speaker: 'Unknown', emotion: 'excited' };
        }
    };

    
    const handleRenderVideo = useCallback(() => {
        try {
            const dataToSend = videoData.map(item => ({
                ...item,
                // Ensure all required fields are present and have proper types
                speaker: item.speaker as 'Munna Bhai' | 'Circuit',
                text: item.text || '',
                audioUrl: item.audioUrl || '',
                durationInFrames: Number(item.durationInFrames) || 90
            }));
            
            const url = `/test/video?data=${encodeURIComponent(JSON.stringify(dataToSend))}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error preparing video data:', error);
            setError('Failed to prepare video data. Please try again.');
        }
    }, [videoData]);
    
    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Munna Bhai & Circuit AI</h1>
                
                <div className="mb-6">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt..."
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Generating...' : 'Generate Conversation'}
                        </button>
                        {videoData.length > 0 && (
                            <button
                                onClick={handleRenderVideo}
                                disabled={isRendering}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {isRendering ? 'Rendering...' : 'Render Video'}
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="space-y-4 mb-8">
                    {lines.map((line, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded shadow">
                            <p className="font-semibold">{line.split(':')[0]}:</p>
                            <p>{line.split(':').slice(1).join(':').trim()}</p>
                            {audios[index]?.data?.[0]?.url && (
                                <audio
                                    controls
                                    src={audios[index].data[0].url}
                                    className="mt-2 w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {showPlayer && videoData.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Generated Video</h2>
                        <div className="aspect-video w-full bg-black rounded overflow-hidden">
                            <Player
                                component={MyVideo}
                                inputProps={{ 
                                    data: videoData.map(item => ({
                                        ...item,
                                        speaker: item.speaker as 'Munna Bhai' | 'Circuit',
                                        text: item.text || '',
                                        audioUrl: item.audioUrl || '',
                                        durationInFrames: Number(item.durationInFrames) || 90
                                    }))
                                }}
                                durationInFrames={videoData.reduce((sum, item) => sum + (Number(item.durationInFrames) || 90), 0)}
                                fps={30}
                                compositionWidth={1080}
                                compositionHeight={1920}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                controls
                                loop
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;

export const SYSTEM_PROMPT_MUNNA_CIRCUIT = `
You are an AI that generates conversations between two iconic characters: **Munna Bhai** and **Circuit** from the movie *Munna Bhai M.B.B.S.*

### Style:
- Use a natural mix of **Hindi + English** (Tapori-style Hinglish).
- Follow the exact tone and mannerisms of Munna Bhai and Circuit as seen in the movie.
- Circuit talks fast, with excitement and a street-smart vibe.
- Munna Bhai speaks with confidence, swag, and a teaching tone, like a lovable gangster-guru.

### Conversation Format:
1. **Circuit** starts with a curious, funny, casual question.
2. **Munna Bhai** explains the concept **clearly**, using **street analogies**, **daily life examples**, and **humor**.
3. Keep it entertaining, but make sure the actual explanation is correct and easy to understand.
4. Use 3–5 dialogue turns.
5. **The last line should always be from Circuit**, reacting to the explanation with a punchy or funny line like:
   - “Bhai ne bola karne ka toh karne ka!”
   - “Solid system hai bhai!”
   - “Next.js toh item hai re bhai!”

### Example:
Query: **What is Next.js?**

Output:
Circuit: Bhai, ye Next.js kya chij hai re? React ka koi jugaad naya naya pakda kya?

Munna Bhai: Arre wah Circuit, tu toh mast sawal puchha hai! Sun, React samajh le ekdum item hai jo humko webpage ke tukde tukde, matlab components me banane deta. Par problem yeh thi ki React ka page slow slow load hota, thoda tension deta. Toh Next.js aya bhai, ekdum jhakaas website banana ka funda! Samajh le React ko fast track pe chada diya.

Circuit: Matlab bhai, Next.js React ka turbo engine hai kya?

Munna Bhai: Bilkul sahi! Jaise local train se express train mein upgrade mila, waise hi Next.js React ko server side pe bhi chalata, seedha fast page load deta. Jaise pehle hum chai milte milte thoda der karte the, ab Next.js wala chai bina line me lage, turant milta.

Circuit: Toh bhai, SEO wala Google bhi impress hota kya isse?

Munna Bhai: Arre haan re! Next.js Google ko bhi dikhata hai sab content seedha seedha. Toh teri site banegi famous, traffic ayega, paisa ayega!

Circuit: Samjha bhai! Ab toh Next.js apna bhi item ban gaya – bhai ne bola karne ka toh karne ka!

### Output Format:
Circuit: [Question in tapori-style Hinglish]  
Munna Bhai: [Explanation in Hinglish + real world examples]  
Circuit: [Follow-up or punchline]  
Munna Bhai: [Further explanation]  
Circuit: [Final punchy one-liner]

Keep it fun, filmy, and full of Mumbaiya swag.
`;
