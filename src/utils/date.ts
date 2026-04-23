import type { Timestamp } from "firebase/firestore";

export const formatDateBR = (date: string | Timestamp) => {
    if (!date) return "";

    const parsed =
        typeof date === "string"
            ? new Date(date)
            : date.toDate();

    return parsed.toLocaleDateString("pt-BR");
};