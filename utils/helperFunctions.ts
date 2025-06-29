export function parseTags(tagsString: string): string[] {
  return tagsString.split(",").map((tag) => tag.trim()).filter(Boolean);
}