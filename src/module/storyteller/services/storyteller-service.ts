import { generateSpeech } from "@/module/text-to-speech/lib/neuphonic";
import { WhoAmIGraph } from "@/module/whoami/graphs/whoami-graph";
import { narrativePrompt } from "./prompt";
import { generateFilename } from "@/module/text-to-speech/lib/file";
import { writeFile } from "fs/promises";

export type GenerateStoryConfig = {
  audioFilePath: string;
  length?: number;
  customPrompt?: string;
};

type GenerateStoryResult =
  | {
      ok: true;
      narrative: string;
      audioPath: string;
    }
  | {
      ok: false;
      error: string;
    };

export class StorytellerService {
  private graph: WhoAmIGraph;

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY not configured");
    }

    this.graph = new WhoAmIGraph(apiKey);
  }

  async generateStory(
    options: GenerateStoryConfig,
  ): Promise<GenerateStoryResult> {
    const _opt = {
      length: 500,
      ...options,
    };

    const { response: narrative } = await this.graph.invoke({
      message: `
      ${narrativePrompt}

      ${_opt.customPrompt}

      IMPORTANT that narrative is no longer than ${_opt.length} Characters
      `,
    });

    const speechGenerationResult = await generateSpeech(narrative);

    if (!speechGenerationResult.ok) {
      return {
        ok: false,
        error: speechGenerationResult.error,
      };
    }

    const filename = generateFilename("story", "wav");

    await writeFile(
      `${_opt.audioFilePath}/${filename}`,
      speechGenerationResult.wav,
    );

    return {
      ok: true,
      narrative,
      audioPath: `/tts-audio/${filename}`,
    };
  }
}
