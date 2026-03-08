import { GoogleGenAI } from "@google/genai";
import { writeFileSync } from "fs";

const ai = new GoogleGenAI({
  vertexai: true,
  project: "claude-mcp-457317",
  location: "us-central1",
});

async function generateDroneLanding() {
  const prompt = `A small black quadcopter drone descending from above and landing on a clean white surface. Shot from eye level, centered framing. As the drone gets close to the ground, fine dust and debris blow outward from the prop wash. The drone wobbles slightly as it stabilizes, then gently touches down on its landing skids. Dust settles. Clean white background, soft natural lighting, realistic physics. No text, no people.`;

  console.log("Starting video generation with Veo 3.1...");

  let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt,
    config: {
      resolution: "720p",
      durationSeconds: "6",
      aspectRatio: "9:16",
      numberOfVideos: 1,
    },
  });

  let attempts = 0;
  while (!operation.done) {
    attempts++;
    console.log(`Polling... attempt ${attempts} (waiting 10s)`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  console.log("Video generation complete!");

  const video = operation.response.generatedVideos[0];
  const videoFile = video.video;

  if (videoFile && videoFile.videoBytes) {
    console.log("Saving video from inline bytes...");
    const buffer = Buffer.from(videoFile.videoBytes, "base64");
    writeFileSync("public/drone-landing.mp4", buffer);
    console.log(`Saved ${buffer.length} bytes to public/drone-landing.mp4`);
  } else if (videoFile && videoFile.uri) {
    console.log("Video URI:", videoFile.uri);
  } else {
    console.log("Unexpected response format:", Object.keys(videoFile || {}));
  }
}

generateDroneLanding().catch(console.error);
