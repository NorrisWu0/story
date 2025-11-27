import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import {
  StorytellerService,
  type GenerateStoryConfig,
} from "@/module/storyteller/services/storyteller-service";
import { join } from "path";

const StoryOptionsSchema = z.object({
  length: z.number().min(100),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const validation = StoryOptionsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: validation.error.issues,
      });
    }

    const options: GenerateStoryConfig = {
      ...validation.data,
      audioFilePath: join(process.cwd(), "public", "tts-audio"),
    };

    const storytellerService = new StorytellerService();

    const result = await storytellerService.generateStory(options);

    if (!result.ok) {
      throw new Error(result.error);
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Storyteller generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
