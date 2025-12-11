import { Profiler } from "@/module/profiler/profiler";

const urls = [
  "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/australia.md",
  "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/bio.md",
  "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/career.md",
  "https://pub-3609c6786e904bc2b95c6093682c92da.r2.dev/fun-things.md",
];

const profiler = new Profiler({
  urls,
});

await profiler.initialize();

export async function POST(request: Request) {
  const { message } = await request.json();

  const response = await profiler.chat(message);

  return Response.json(response);
}
