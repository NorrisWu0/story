import { createClient, toWav } from "@neuphonic/neuphonic-js";

const Neuphonic = {
  ApiKey: process.env.NEUPHONIC_API_KEY || "",
};

const client = createClient({
  apiKey: Neuphonic.ApiKey,
});

export const sse = await client.tts.sse({
  speed: 1.15,
  lang_code: "en",
});

type GenerateSpeechResult =
  | {
      ok: true;
      wav: Uint8Array<ArrayBufferLike>;
    }
  | {
      ok: false;
      error: string;
    };

export async function generateSpeech(
  text: string,
): Promise<GenerateSpeechResult> {
  try {
    const res = await sse.send(text);
    const wav = toWav(res.audio);

    return {
      ok: true,
      wav,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}
