import { Audio, Img, Sequence, AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate } from 'remotion';

type WordType = {
  text: string;
  opacity: number;
};

type ConversationVideoProps = {
  speaker: 'Munna Bhai' | 'Circuit';
  text: string;
  audioUrl: string;
  durationInFrames: number;
};

export const ConversationVideo = ({
  speaker,
  text,
  audioUrl,
  durationInFrames,
}: ConversationVideoProps) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const imagePath = speaker === 'Circuit' ? '/circuit.png' : '/munna.png';

  // Split text into words and create animation states
  const words = text.split(' ');
  const wordDuration = 5; // frames per word

  // Create animated words
  const animatedWords = words.map((word, i) => {
    const startFrame = i * wordDuration;
    const endFrame = startFrame + wordDuration;
    const opacity = interpolate(
      frame,
      [startFrame, startFrame + 1, endFrame - 1, endFrame],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return { text: word, opacity };
  });

  return (
    <Sequence durationInFrames={durationInFrames}>
      <AbsoluteFill>
        {/* Content Overlay */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <Img
            src={imagePath}
            style={{
              width: Math.min(500, width * 0.8),
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          />
          <div
            style={{
              fontSize: Math.min(40, width * 0.04),
              marginTop: 40,
              maxWidth: Math.min(900, width * 0.9),
              textAlign: 'center',
              padding: '0 20px',
              lineHeight: 1.4,
              minHeight: '3em',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.2em',
            }}
          >
            {animatedWords.map((word, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${10 * (1 - word.opacity)}px)`,
                  transition: 'all 0.2s ease-out',
                }}
              >
                {word.text}{' '}
              </span>
            ))}
          </div>
          {audioUrl && <Audio src={audioUrl} volume={1} />}
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};
