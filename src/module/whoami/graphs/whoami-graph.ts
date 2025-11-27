import { ChatDeepSeek } from "@langchain/deepseek";
import { getWhoAmIContext } from "@/module/whoami/data/loader";

export type ChatMessage = ["human" | "system" | "ai", string];

export type WhoAmIGraphInput = {
  message: string;
  history?: ChatMessage[];
};

export type WhoAmIGraphOutput = {
  response: string;
  context: string;
};

/**
 * Simple whoami chat graph that loads context and generates responses
 */
export class WhoAmIGraph {
  private model: ChatDeepSeek;
  private context: string;

  constructor(apiKey: string) {
    this.model = new ChatDeepSeek({
      apiKey,
      model: "deepseek-chat",
      temperature: 0.7,
    });
    this.context = getWhoAmIContext();
  }

  /**
   * Process a user message and generate a response
   */
  async invoke(input: WhoAmIGraphInput): Promise<WhoAmIGraphOutput> {
    const { message, history = [] } = input;

    // Build system prompt with context
    const systemPrompt = `You are a helpful AI assistant that answers questions about a person based on the provided information.

Here is the information about the person:

${this.context}

Instructions:
- Answer questions based only on the information provided above
- Be conversational and friendly
- If asked about something not in the documents, politely say you don't have that information
- Keep responses extremely concise but informative
- Keep response character length with in 250 characters, unless the prompt explicitly said otherwise
- You can ask follow-up questions to better understand what the user wants to know`;

    // Build message history
    const messages: ChatMessage[] = [
      ["system", systemPrompt],
      ...history,
      ["human", message],
    ];

    // Invoke the model
    const result = await this.model.invoke(messages);
    const response = result.content.toString();

    return {
      response,
      context: this.context,
    };
  }

  /**
   * Get the loaded context (for debugging)
   */
  getContext(): string {
    return this.context;
  }
}
