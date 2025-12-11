import { ProfilerUI } from "@/module/profiler/component/profiler-ui";

export default async function Page() {
  async function chat(message: string) {
    "use server";

    const res = await fetch("http://localhost:3000/api/profiler", {
      method: "POST",
      body: JSON.stringify({
        message,
      }),
    });

    const data = await res.json();

    return data;
  }

  return <ProfilerUI onSubmit={chat} />;
}
