import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Load all text and markdown files from the whoami data directory
 * and concatenate them into a single context string.
 *
 * @returns Concatenated context from all document files
 */
export function getWhoAmIContext(): string {
  const dir = join(process.cwd(), "public/portfolio");
  
  try {
    // Read all files in the directory
    const files = readdirSync(dir).filter(
      (f) =>
        (f.endsWith(".txt") || f.endsWith(".md"))
    );

    if (files.length === 0) {
      return "No documents found. Please add .txt or .md files to /portfolio";
    }

    // Read and concatenate all files
    return files
      .map((file) => {
        const content = readFileSync(join(dir, file), "utf-8");
        return `--- ${file} ---\n${content}`;
      })
      .join("\n\n");
  } catch (error) {
    console.error("Error loading WhoAmI context:", error);
    return "Error loading documents";
  }
}
