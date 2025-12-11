import { DeepSeekAI } from "./ai/deepseek";
import { DataLoader } from "./data/loader";
import { profilerPrompt } from "./prompt";

export class Profiler {
  status: "idle" | "initialized" = "idle";
  private ai: DeepSeekAI;
  private dataLoader: DataLoader;

  constructor(
    private config: {
      urls: string[];
      apiKey?: string;
      maxHistoryMessages?: number;
    },
  ) {
    this.ai = new DeepSeekAI({
      systemPrompt: "",
      apiKey: this.config.apiKey,
    });
    this.dataLoader = new DataLoader();
  }

  async initialize() {
    const result = await this.dataLoader.fromUrls(this.config.urls);

    if (!result.ok) {
      throw new Error(`Failed to load data: ${result.error}`);
    }

    const systemPrompt = profilerPrompt(result.text);
    this.ai.setSystemPrompt(systemPrompt);
    this.status = "initialized";
    console.log("Profiler initialized.");
  }

  async chat(message: string) {
    if (this.status !== "initialized") {
      throw new Error("Profiler not initialized. Call initialize() first.");
    }
    return this.ai.chat(message);
  }
}
