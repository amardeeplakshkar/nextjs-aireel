import { AbsoluteFill, Sequence, useVideoConfig, Video } from 'remotion';
import { ConversationVideo } from './ConversationVideo';

export type VideoData = {
  speaker: 'Munna Bhai' | 'Circuit';
  text: string;
  audioUrl: string;
  durationInFrames: number;
};

type MyVideoProps = {
  data: VideoData[];
};

export const MyVideo = ({ data }: MyVideoProps) => {
  const { fps } = useVideoConfig();
  let currentFrame = 0;

  // Calculate total duration for the background video
  const totalDuration = data.reduce((sum, line) => sum + line.durationInFrames, 0);

  return (
    <>
      {/* Background Video - Single instance at the root level */}
      <AbsoluteFill>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Video 
            src="/bg.mp4" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            volume={0.2}
            playbackRate={0.8}
            muted
            loop
          />
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }} />
      </AbsoluteFill>

      {/* Conversation Sequences */}
      {data.map((line, i) => {
        const startFrame = currentFrame;
        const duration = line.durationInFrames;
        currentFrame += duration;

        return (
          <Sequence key={i} from={startFrame} durationInFrames={duration}>
            <ConversationVideo 
              speaker={line.speaker} 
              text={line.text} 
              audioUrl={line.audioUrl} 
              durationInFrames={duration} 
            />
          </Sequence>
        );
      })}
    </>
  );
};
