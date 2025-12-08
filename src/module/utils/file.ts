export function generateFilename(basename: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${basename}-${timestamp}.${extension}`;
}
