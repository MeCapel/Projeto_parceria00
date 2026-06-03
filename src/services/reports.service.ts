import { api } from "./api";

export async function generateOccurrenceReport(occurrenceId: string) {
  const response = await api.post(
    "/documents/generate",
    { occurrenceId },
    { responseType: "blob" }
  );
  return response;
}
