export type ScriptureVerse = {
  id: string;
  reference: string;
  content: string;
  verse_number: number;
};

export type ScriptureReference = {
  reference: string;
  bible_id: number;
  verses: ScriptureVerse[];
  content: string;
};

export async function fetchScriptureReference(
  reference: string,
  bibleId: number
) {
  const params = new URLSearchParams({
    reference,
    bible_id: String(bibleId),
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/scripture/reference?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch scripture reference");
  }

  return response.json() as Promise<ScriptureReference>;
}