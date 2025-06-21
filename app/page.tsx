import React from 'react'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai';
import { TextToSpeechSpeaker } from 'sarvamai/api';

const openai = createOpenAI({
  baseURL: 'https://text.pollinations.ai/openai',
    apiKey: 'sk-1234567890',
});


const Page = async () => {
  const result = await generateText({
    model: openai('openai'),
    system: SYSTEM_PROMPT_MUNNA_CIRCUIT,
    prompt: 'What is RAG?',
  });

  const lines = result.text.split('\n').filter(line => line.trim() !== '');

  const getSpeakerVoice = (line: string): { speaker: string, voice: string } => {
    if (line.startsWith('Munna Bhai:')) {
      return { speaker: 'Munna Bhai', voice: 'alloy' };
    } else if (line.startsWith('Circuit:')) {
      return { speaker: 'Circuit', voice: 'shimmer' };
    } else {
      return { speaker: 'Unknown', voice: 'shimmer' }; 
    }
  };

  const audios = await Promise.all(
    lines.map(async (line) => {
      const { voice } = getSpeakerVoice(line);
      const audioRes = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        body: JSON.stringify({
          model: "openai-audio",
          modalities: ["audio"],
          audio: { "voice": voice, "format": "mp3" },
          messages: [{ role: "user", content: "hello bhai" }],
        }),
      })
      return audioRes.json()
    })
  )

  console.log("audios", audios)

  return (
    <div className="bg-blue-500/10 p-4 border rounded-2xl m-2 space-y-4">
      {lines.map((line, i) => (
        <div key={i} className="p-2  rounded shadow">
          <p className="mb-2 font-medium">{line}</p>
          <audio controls>
            <source src={`data:audio/mp3;base64,${audios[i].choices[0].audio}`} type="audio/mpeg" />
          </audio>
        </div>
      ))}
    </div>
  );
};

export default Page;

const SYSTEM_PROMPT_MUNNA_CIRCUIT = `
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
