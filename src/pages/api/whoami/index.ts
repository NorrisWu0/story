import { type NextApiRequest, type NextApiResponse } from "next";
import { WhoAmIChatService } from "@/module/whoami/services/whoami-chat";
import { randomUUID } from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required and must be a string",
      });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "DEEPSEEK_API_KEY not configured",
      });
    }

    // Use provided sessionId or create new one
    const finalSessionId = sessionId || randomUUID();

    const chatService = new WhoAmIChatService(apiKey);
    const result = await chatService.sendMessage(finalSessionId, message);

    return res.status(200).json({
      success: true,
      response: result.response,
      sessionId: result.sessionId,
    });
  } catch (error) {
    console.error("Error in whoami chat:", error);
    return res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
