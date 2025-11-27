import {
  WhoAmIGraph,
  ChatMessage,
  WhoAmIGraphInput,
} from "@/whoami/graphs/whoami-graph";

type ChatSession = {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
}

/**
 * In-memory store for chat sessions
 */
class ChatSessionStore {
  private sessions: Map<string, ChatSession> = new Map();

  create(sessionId: string): ChatSession {
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  get(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  addMessage(sessionId: string, message: ChatMessage): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
    }
  }

  delete(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getOrCreate(sessionId: string): ChatSession {
    let session = this.get(sessionId);
    if (!session) {
      session = this.create(sessionId);
    }
    return session;
  }
}

export const chatSessionStore = new ChatSessionStore();

/**
 * Chat service that uses WhoAmIGraph to process messages
 */
export class WhoAmIChatService {
  private graph: WhoAmIGraph;

  constructor(apiKey: string) {
    this.graph = new WhoAmIGraph(apiKey);
  }

  /**
   * Send a message and get a response
   */
  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<{ response: string; sessionId: string }> {
    // Get or create session
    const session = chatSessionStore.getOrCreate(sessionId);

    // Add user message to history
    const userMessage: ChatMessage = [ "human", message ];
    chatSessionStore.addMessage(sessionId, userMessage);

    // Get response from graph
    const input: WhoAmIGraphInput = {
      message,
      history: session.messages.slice(0, -1), // Exclude the message we just added
    };

    const result = await this.graph.invoke(input);

    // Add assistant response to history
    const assistantMessage: ChatMessage = [
      "ai",
      result.response,
    ];

    chatSessionStore.addMessage(sessionId, assistantMessage);

    return {
      response: result.response,
      sessionId,
    };
  }

  /**
   * Get conversation history for a session
   */
  getHistory(sessionId: string): ChatMessage[] {
    const session = chatSessionStore.get(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Clear a session
   */
  clearSession(sessionId: string): boolean {
    return chatSessionStore.delete(sessionId);
  }

  /**
   * Get the loaded context (for debugging)
   */
  getContext(): string {
    return this.graph.getContext();
  }
}
