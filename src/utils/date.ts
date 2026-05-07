import type { Timestamp } from "firebase/firestore";

export const formatDateBR = (date: string | Timestamp | Date | null | undefined) => {
    if (!date) return "";
    
    let parsed: Date;
    
    // Handle string (ISO format)
    if (typeof date === "string") {
        parsed = new Date(date);
    }
    // Handle Date object
    else if (date instanceof Date) {
        parsed = date;
    }
    // Handle Firebase Timestamp
    else if (typeof date === "object" && "toDate" in date) {
        parsed = (date as Timestamp).toDate();
    }
    // Fallback: try to create Date from value
    else {
        parsed = new Date(date as any);
    }
    
    // Validate the date is valid
    if (isNaN(parsed.getTime())) {
        return "";
    }
    
    return parsed.toLocaleDateString("pt-BR");
};