import { Composition } from 'remotion';
import { MyVideo } from '../test/Video';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          data: [
            {
              speaker: 'Munna Bhai',
              text: 'Hello from Munna Bhai!',
              audioUrl: '',
              durationInFrames: 150,
            },
            {
              speaker: 'Circuit',
              text: 'Hello from Circuit!',
              audioUrl: '',
              durationInFrames: 150,
            },
          ],
        }}
      />
    </>
  );
};
