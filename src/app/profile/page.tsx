import { ProfilerUI } from "@/module/profiler/component/profiler-ui";
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();

  const protocal = headersList.get("x-forwarded-proto");
  const host = headersList.get("x-forwarded-host");

  async function chat(message: string) {
    "use server";

    const apiUrl = `${protocal}://${host}/api/profiler`;
    console.debug({
      apiUrl,
      message,
    });

    const res = await fetch(apiUrl, {
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
