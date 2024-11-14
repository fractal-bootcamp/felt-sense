import { NextResponse } from "next/server";
import { getSession } from "@workos-inc/authkit-nextjs";
import { transcribeFile } from "../../../lib/utils/transcribeFile";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    console.log('session', session);
    const audioBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    const result = await transcribeFile(buffer);

    return NextResponse.json({
      user: session?.user,
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