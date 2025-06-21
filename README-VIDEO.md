# AI Reels - Video Generation with Remotion

This project integrates Remotion for video generation in your Next.js application. It allows you to create AI-generated conversations between Munna Bhai and Circuit, and render them as videos.

## Features

- Generate conversations between Munna Bhai and Circuit using AI
- Convert text to speech for each character
- Render conversations as videos with subtitles
- Preview and download generated videos

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Remotion dependencies:
   ```bash
   npm install remotion @remotion/player
   ```

3. Add the following environment variables to your `.env.local` file:
   ```
   NEXT_PUBLIC_REMOTION_APP_NAME=ai-reels
   ```

## How to Use

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/test in your browser

3. Enter a prompt for the conversation and click "Generate Conversation"

4. Once the conversation is generated, click "Render Video" to see the video preview

5. The video will open in a new tab where you can play it and see the conversation segments

## Project Structure

- `/app/test/page.tsx` - Main page for generating conversations
- `/app/test/video/page.tsx` - Video preview and rendering page
- `/app/test/Video.tsx` - Main video component using Remotion
- `/app/test/ConversationVideo.tsx` - Component for individual conversation segments
- `/app/remotion/Root.tsx` - Root component for Remotion
- `/app/utils/audioUtils.ts` - Utility functions for audio handling

## Customization

You can customize the video appearance by modifying the components in `/app/test/Video.tsx` and `/app/test/ConversationVideo.tsx`. The current implementation includes:

- Character avatars (Munna Bhai and Circuit)
- Styled subtitles
- Audio playback synchronized with the video
- Responsive layout

## Deployment

For production deployment, make sure to build the application:

```bash
npm run build
npm start
```

## Dependencies

- Next.js 13+
- React 18+
- Remotion 4+
- Tailwind CSS

## License

MIT
