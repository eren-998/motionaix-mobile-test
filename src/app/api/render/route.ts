import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import os from "os";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { compositionId, inputProps = {}, resolution = "720p" } = body;

    if (!compositionId) {
      return new Response(JSON.stringify({ error: "compositionId is required" }), { status: 400 });
    }

    // Serverless limitations check
    if (process.env.VERCEL) {
      return new Response(JSON.stringify({ 
        error: "LIMITATION: Remotion rendering requires Chromium which exceeds Vercel's limits. Run locally with 'npm run dev'."
      }), { status: 400 });
    }

    const entry = path.resolve(process.cwd(), "src/remotion/index.ts");
    
    console.log(`Bundling composition "${compositionId}" via Webpack...`);
    const bundleLocation = await bundle({
      entryPoint: entry,
      webpackOverride: (config) => config,
    });
    
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
    
    const fileBuffer = fs.readFileSync(outputLocation);
    fs.unlinkSync(outputLocation);
    
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${compositionId}.mp4"`
      }
    });
    
  } catch (error: unknown) {
    console.error("Render error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500 });
  }
}
