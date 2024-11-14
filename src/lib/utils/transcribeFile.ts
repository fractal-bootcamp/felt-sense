export const transcribeFile = async (audioFile: Buffer): Promise<string> => {
  console.log("here");
  console.log("transcribing file");

  const response = await fetch("https://api.deepgram.com/v1/listen", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      "Content-Type": "audio/wav",
    },
    body: audioFile, // Assuming audioFile is a Blob or a Buffer
  });

  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.statusText}`);
  }

  const result = await response.json();
  console.dir(result, { depth: null });
  return result.results.channels[0].alternatives[0].transcript;
};
