"use client";

export const transcribeAudioStream = async (
  // Convert ReadableStream to Blob
  readable: ReadableStream,
  conversationId: string
) => {
  const reader = readable.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks, { type: "audio/webm" }); // Adjust mime type if needed

  const response = await fetch("/api/stt", {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": "audio/webm", // Adjust mime type if needed
      "x-conversation-id": conversationId, // Include your metadata here
    },
  });
  return response.json();
};

export const callLLM = async (conversationId: string) => {
  try {
    const response = await fetch("/api/LLM", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The middleware will automatically add the session header
      },
      body: JSON.stringify({ conversationId }),
      credentials: 'same-origin' // Important for cookie handling
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("LLM call failed:", error);
    throw error;
  }
};

export const speakText = async (text: string) => {
  const response = await fetch("/api/tts", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  // Read the entire stream instead of just the first chunk

  const chunks = [];
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log("pushing chunk");
    chunks.push(value);
  }
  console.log(chunks[0], chunks.length);

  const audioBlob = new Blob(chunks, { type: "audio/wav" }); // Adjust mime type if needed
  const audioUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio(audioUrl);
  console.log("about to play audio");
  await audio.play();
  console.log("played audio");
};
