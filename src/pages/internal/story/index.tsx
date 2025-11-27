import { useState, useCallback, useEffect } from "react";
import { StoryRoller } from "@/module/storyteller/components/story-roller";

export default function StoryPage() {
  const { story, isLoading, error, generateStory } = useStory();

  useEffect(() => {
    generateStory({ length: 1500 });
  }, [generateStory]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <p>Generating story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <p>No story available</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-8">
      <StoryRoller
        narrative={story.narrative}
        audioFilePath={story.audioPath}
      />
    </div>
  );
}

type StoryResult = {
  ok: boolean;
  narrative: string;
  audioPath: string;
  error?: string;
};

type GenerateStoryOptions = {
  length: number;
};

function useStory() {
  const [story, setStory] = useState<StoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = useCallback(async (options: GenerateStoryOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      const data = (await response.json()) as StoryResult;

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to generate story");
      }

      setStory(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    story,
    isLoading,
    error,
    generateStory,
  };
}
