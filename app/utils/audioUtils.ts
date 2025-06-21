export const getAudioDuration = async (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      // Convert seconds to frames (30fps)
      resolve(Math.ceil(audio.duration * 30));
    };
    audio.onerror = () => {
      console.error('Error loading audio for duration calculation');
      // Default to 3 seconds if we can't load the audio
      resolve(90); // 3 seconds at 30fps
    };
  });
};
