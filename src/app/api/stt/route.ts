import { NextRequest, NextResponse } from "next/server";
import { transcribeFile } from "../../../lib/stt/transcribe";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-authenticated-user-id");
    console.log("userId", userId);
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    const result = await transcribeFile(buffer);

    return NextResponse.json({
      message: "Audio processed successfully",
      success: true,
      transcript: result,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      {
        message: "Error processing audio",
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

if (!process.env.DEEPGRAM_API_KEY) {
  throw new Error("DEEPGRAM_API_KEY is not set");
}
