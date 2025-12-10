import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "@/module/profiler";
import { ChatInput } from "@/components/chat-input";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize profiler on mount
  useEffect(() => {
    async function init() {
      setIsInitializing(true);
      setInitError(null);

      try {
        // Default URLs - you can customize these
        const urls = [
          "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/australia.md",
          "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/bio.md",
          "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/career.md",
          "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/fun-things.md",
        ];

        const response = await fetch("/api/profiler/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "init",
            urls,
            maxHistoryMessages: 40,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setSessionId(data.sessionId);
      } catch (error) {
        setInitError(
          error instanceof Error ? error.message : "Failed to initialize chat",
        );
      } finally {
        setIsInitializing(false);
      }
    }

    init();
  }, []);

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        fetch("/api/profiler/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            sessionId,
          }),
        }).catch(() => {
          // Ignore errors on cleanup
        });
      }
    };
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isChatting]);

  const handleSend = useCallback(
    async (message: string) => {
      if (!sessionId || isChatting) return;

      setIsChatting(true);

      try {
        const response = await fetch("/api/profiler/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            sessionId,
            message,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setHistory(data.history);
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsChatting(false);
      }
    },
    [sessionId, isChatting],
  );

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Initializing chat...</div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">Error: {initError}</div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[75vh] h-full w-full flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {history.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Start a conversation...
            </div>
          ) : (
            history.map(([role, content], i) => (
              <div key={role + crypto.randomUUID()} className="space-y-2">
                {role === "human" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg bg-foreground px-4 py-2 text-background">
                      {content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] space-y-1">
                      <div className="text-xs text-muted-foreground">AI</div>
                      <div className="text-foreground">
                        <span className="whitespace-pre-wrap">{content}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isChatting && (
            <div className="flex justify-start">
              <div className="max-w-[80%] space-y-1">
                <div className="text-xs text-muted-foreground">AI</div>
                <div className="text-foreground">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isChatting} autoFocus />
        </div>
      </div>
    </div>
  );
}
