# AI Reels Generator

A Next.js application that generates engaging video reels featuring AI-powered conversations between characters, with synchronized audio and animated subtitles.

## 🚀 Features

- **AI-Powered Dialogues**: Generate natural conversations between characters using AI
- **Text-to-Speech**: Convert dialogue text to natural-sounding speech
- **Animated Subtitles**: Word-by-word subtitle animation for better engagement
- **Responsive Video Player**: Built with Remotion for smooth playback
- **Customizable Characters**: Easy to add or modify characters and their voices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Animation & Video**: Remotion
- **AI & APIs**: OpenAI API, Custom TTS Service
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.x
- OpenAI API key
- TTS Service URL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amardeeplakshkar/nextjs-aireels.git
   cd nextjs-aireels
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_BASE_URL=https://api.openai.com/v1
   CLIENT_TTS=your_tts_service_url
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎬 Generating Reels

1. Navigate to the test page at `/test`
2. Enter your prompt or conversation topic
3. Click "Generate Conversation"
4. The system will generate a conversation, create audio for each line, and prepare the video
5. Click "Preview Video" to see the result

## 🏗️ Project Structure

```
ai-reels/
├── app/
│   ├── api/                  # API routes
│   │   ├── chat/             # AI conversation generation
│   │   └── tts/              # Text-to-speech conversion
│   ├── test/                 # Main application page
│   │   ├── ConversationVideo.tsx  # Video component
│   │   ├── Video.tsx         # Video rendering logic
│   │   └── page.tsx          # Main test page
│   └── ...
├── public/                   # Static assets
│   ├── circuit.png           # Character image
│   ├── munna.png             # Character image
│   └── bg.mp4                # Background video
├── scripts/                  # Utility scripts
│   └── render.ts             # Video rendering script
└── ...
```

## 🤖 How It Works

1. **Conversation Generation**: The app sends a prompt to the AI API to generate a conversation between characters.
2. **Audio Generation**: Each line of dialogue is sent to a TTS service to generate audio.
3. **Video Composition**: The app uses Remotion to compose the final video with:
   - Background video
   - Character avatars
   - Animated subtitles
   - Synchronized audio

## 📝 Customization

### Adding New Characters

1. Add character images to the `public/` directory
2. Update the character mapping in the relevant components
3. Configure TTS voices for the new characters

### Modifying Styles

Edit the Tailwind CSS classes in the React components to change the appearance of:
- Video player
- Character avatars
- Subtitles
- Buttons and UI elements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Amardeep Lakshkar](https://github.com/amardeeplakshkar)
- Special thanks to the open-source community for amazing tools and libraries

---

Made with [Next.js](https://nextjs.org/) and [Remotion](https://www.remotion.dev/)
