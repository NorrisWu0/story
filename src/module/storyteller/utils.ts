export function stripSSMLTags(text: string) {
  return text.replace(/<[^>]*>/g, "").trim();
}
