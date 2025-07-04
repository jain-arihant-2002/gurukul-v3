export function parseTags(tagsString: string): string[] {
  return tagsString.split(",").map((tag) => tag.trim()).filter(Boolean);
}// will change this parse json as will store tags array as json in db