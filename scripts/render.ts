import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import path from 'path';
import type { VideoData } from '../app/test/Video';

interface RenderOptions {
    output: string;
    data: VideoData[];
    codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'mp3' | 'wav' | 'aac' | 'prores' | 'h264-ts';
    quality?: number;
    overwrite?: boolean;
}

export async function renderVideoToFile(options: RenderOptions) {
    const {
        output,
        data,
        codec = 'h264',
        quality = 80,
        overwrite = true,
    } = options;

    console.log('Bundling video...');
    const bundleLocation = await bundle({
        entryPoint: path.join(process.cwd(), 'app/remotion/Root.tsx'),
        webpackOverride: (config) => {
            // Add any necessary webpack overrides here
            return config;
        },
    });

    console.log('Fetching compositions...');
    const compositions = await getCompositions(bundleLocation);
    const composition = compositions.find((c) => c.id === 'MyVideo');

    if (!composition) {
        throw new Error(`No composition with ID 'MyVideo' found.`);
    }

    console.log('Rendering video...');
    await renderMedia({
        codec,
        composition,
        serveUrl: bundleLocation,
        outputLocation: output,
        inputProps: { data },
        onProgress: ({ progress }) => {
            console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
        },
        overwrite,
        // quality,
        imageFormat: 'jpeg',
    });

    console.log(`\nVideo rendered successfully to: ${output}`);
    return output;
}

// If this file is run directly (not imported)
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: ts-node scripts/render.ts <output-path> <json-data>');
        process.exit(1);
    }

    const [outputPath, jsonData] = args;

    try {
        const data = JSON.parse(jsonData);
        renderVideoToFile({
            output: outputPath,
            data,
        }).catch(console.error);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        process.exit(1);
    }
}
