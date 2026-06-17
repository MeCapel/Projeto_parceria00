import type { Timestamp } from "firebase/firestore";

export const formatDateBR = (
  date: string | Timestamp | Date | null | undefined
) => {
  if (!date) return "";

  let parsed: Date;

  if (typeof date === "string") {
    parsed = new Date(date);
  } else if (date instanceof Date) {
    parsed = date;
  } else {
    parsed = date.toDate(); // Timestamp
  }

  if (isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("pt-BR");
};