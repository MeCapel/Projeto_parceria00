import { Timestamp } from "firebase/firestore";

export const calcularOpenDays = (timestamp: Timestamp | Date | string | null | undefined): number => {
  if (!timestamp) return 0;

  // Conversão para Date
  let dateOpen: Date;

  if (timestamp instanceof Timestamp) {
    dateOpen = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    dateOpen = timestamp;
  } else {
    dateOpen = new Date(timestamp);
  }

  const today = new Date();

  // Cálculo da diferença
  const diffInMs = today.getTime() - dateOpen.getTime();
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return days >= 0 ? days : 0;
};