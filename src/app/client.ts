"use client";

export const sendAudioStream = async (readable: ReadableStream) => {
  // Convert ReadableStream to Blob
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
    credentials: "include", // Properly add withCredentials:true
  });
  return response.json();
};
