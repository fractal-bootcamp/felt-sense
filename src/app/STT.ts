// "use server";

// import { createClient, FileSource } from "@deepgram/sdk";
// import fs from "fs";
// import path from "path";

// if (!process.env.DEEPGRAM_API_KEY) {
//   throw new Error("DEEPGRAM_API_KEY is not set");
// }

// // import { spawn } from "child_process";

// // const recordAudio = (duration = 10): Promise<void> => {
// //   return new Promise<void>((resolve, reject) => {
// //     const audioFile = fs.createWriteStream("output.wav");
// //     const arecord = spawn("ffmpeg", [
// //       "-f",
// //       "pulse", // Changed to use PulseAudio for audio recording
// //       "-i",
// //       "default", // Use default audio input
// //       "-t",
// //       duration.toString(),
// //       "-acodec",
// //       "pcm_s16le",
// //       "-ar",
// //       "16000",
// //       "-ac",
// //       "1",
// //       "output.wav",
// //     ]);

// //     arecord.stdout.pipe(audioFile);

// //     arecord.on("close", (code) => {
// //       console.log(`Recording stopped with code ${code}`);
// //       if (code === 0) {
// //         resolve();
// //       } else {
// //         reject(new Error(`Recording failed with code ${code}`));
// //       }
// //     });
// //   });
// // };

// // // Call the function to start recording and wait for it to finish
// // await recordAudio(10);

// export const transcribeFile = async (
//   audioFile: FileSource
// ): Promise<string> => {
//   console.log("transcribing file");
//   const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
//   // const audio = fs.createReadStream("test.m4a");
//   const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
//     audioFile,
//     {
//       model: "nova-2",
//       smart_format: true,
//     }
//   );
//   if (error) throw error;
//   if (!error) console.dir(result, { depth: null });
//   return result.results.channels[0].alternatives[0].transcript;
// };

// // const result = await transcribeFile();
// // console.log("result", result);

// // export default async function handler(
// //   req: NextApiRequest,
// //   res: NextApiResponse
// // ): Promise<string> {
// //   if (req.method !== "POST") {
// //     return res.status(405).json({ message: "Method not allowed" }); // Handle non-POST requests
// //   }

// //   const { audioFile } = req.body; // Get audioFile from request body

// //   try {
// //     const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
// //     const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
// //       audioFile,
// //       {
// //         model: "nova-2",
// //         smart_format: true,
// //       }
// //     );

// //     if (error) throw error;
// //     return res.status(200).json(result); // Return the transcription result
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message }); // Handle errors
// //   }
// // }

// const audioFile = fs.readFileSync(path.join(__dirname, "taunt.wav"));
// const result = await transcribeFile(audioFile);
// console.log(result);
