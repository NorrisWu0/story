"use client";

import { type FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { TextType } from "@/components/text-type";

type Response =
  | {
      state: "idle";
    }
  | {
      state: "loading";
    }
  | {
      state: "loaded";
      message: string;
    };

export function ProfilerUI(props: {
  onSubmit: (message: string) => Promise<string>;
}) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<Response>({
    state: "idle",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setResponse({
      state: "loading",
    });

    const response = await props.onSubmit(message);

    setResponse({
      state: "loaded",
      message: response,
    });
  };

  return (
    <form className="flex-1 w-full flex flex-col mt-4" onSubmit={handleSubmit}>
      {response.state === "idle" && (
        <TypeingText
          text={
            "Hi! I'm here to help you learn about Norris. What would you like to know?"
          }
        />
      )}
      {response.state === "loading" && <TypeingText text={"Thinking......"} />}
      {response.state === "loaded" && <TypeingText text={response.message} />}
      <Input
        className="mt-auto text-base placeholder:text-base"
        type="text"
        name="message"
        placeholder="write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
}

function TypeingText(props: { text: string }) {
  return (
    <TextType
      className="text-4xl"
      text={props.text}
      loop={false}
      typingSpeed={10}
      showCursor={false}
    />
  );
}
