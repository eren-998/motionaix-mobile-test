import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import os from "os";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination, fps = 30, resolution = "720p", templateId } = body;
    
    // Serverless limitations check: Vercel standard free tier cannot run Puppeteer or render longer than 10s.
    if (process.env.VERCEL) {
      return new Response(JSON.stringify({ 
        error: "LIMITATION: You are running this on Vercel's standard serverless functions. Remotion Studio rendering requires Chromium (which is 150MB+, exceeding Vercel's 50MB limit) and takes longer than the 10-second serverless timeout. To fix this in production, you must use Remotion Lambda (AWS) or a dedicated Node.js server. Please test this feature locally by running 'npm run dev' on your PC and accessing it via your local network IP on mobile."
      }), { status: 400 });
    }

    let compWidth = 1280;
    let compHeight = 720;
    if (resolution === "1080p") {
      compWidth = 1920;
      compHeight = 1080;
    }

    const compositionId = templateId || "EarthTravel"; 
    const entry = path.resolve(process.cwd(), "src/remotion/index.ts");
    
    console.log("Bundling video via Webpack...");
    const bundleLocation = await bundle({
      entryPoint: entry,
      webpackOverride: (config) => config,
    });
    
    const inputProps = { origin, destination };
    
    console.log("Selecting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });
    
    const outDir = path.join(os.tmpdir(), "motionaix-renders");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    const outputLocation = path.join(outDir, `${compositionId}_${Date.now()}.mp4`);

    console.log("Rendering media with headless Chrome...");
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps,
    });

    console.log("Render complete!");
    
    // Read the file and return it as a download
    const fileBuffer = fs.readFileSync(outputLocation);
    
    // Cleanup to save space
    fs.unlinkSync(outputLocation);
    
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${compositionId}.mp4"`
      }
    });
    
  } catch (error: any) {
    console.error("Render error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
