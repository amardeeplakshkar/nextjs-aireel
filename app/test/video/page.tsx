'use client';

import { Player } from '@remotion/player';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { MyVideo } from '../Video';

type VideoData = {
  speaker: 'Munna Bhai' | 'Circuit';
  text: string;
  audioUrl: string;
  durationInFrames: number;
};

function VideoContent() {
  const searchParams = useSearchParams();
  const videoData: VideoData[] = useMemo(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        return JSON.parse(decodeURIComponent(data));
      }
    } catch (e) {
      console.error('Error parsing video data:', e);
    }
    return [];
  }, [searchParams]);

  const totalDuration = useMemo(
    () => videoData.reduce((sum: number, item: VideoData) => sum + (item.durationInFrames || 0), 0),
    [videoData]
  );

  if (videoData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No video data found</h1>
          <p>Please generate a video from the main page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generated Video</h1>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <div className="aspect-[9/16] w-full bg-black rounded overflow-hidden">
            <Player
              component={MyVideo}
              inputProps={{ data: videoData }}
              durationInFrames={totalDuration}
              fps={30}
              compositionWidth={1080}
              compositionHeight={1920}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              doubleClickToFullscreen
              loop
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Video Segments</h2>
          {videoData.map((segment: VideoData, index: number) => (
            <div key={index} className="p-4 bg-gray-800 rounded shadow">
              <p className="font-semibold">{segment.speaker}</p>
              <p className="mb-2">{segment.text}</p>
              <p className="text-sm text-gray-500">
                Duration: {(segment.durationInFrames / 30).toFixed(1)} seconds
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VideoPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading video player...</p>
          </div>
        </div>
      }
    >
      <VideoContent />
    </Suspense>
  );
}
