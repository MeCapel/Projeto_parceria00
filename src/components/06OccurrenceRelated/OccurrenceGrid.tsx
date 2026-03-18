// ===== GERAL IMPORTS =====

import type { OccurrenceProps } from "../../services/occurrenceServices";
import OccurrenceCard from "./OccurrenceCard"

// ===== TYPE INTERFACES =====

interface Props {
  occurrences: OccurrenceProps[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
};

export default function OccurenceGrid({ occurrences, onDelete, onEdit }: Props)
{
  const criticityOrder: Record<"A" | "B" | "C", number> = {
      A: 1,
      B: 2,
      C: 3
  };

  const sortedOccurrences = [...occurrences].sort(
      (a, b) =>
          (criticityOrder[a.criticity as "A" | "B" | "C"] ?? 99) -
          (criticityOrder[b.criticity as "A" | "B" | "C"] ?? 99)
  );

  return(
      <div
        className="my-5"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
          justifyItems: "start"
        }}
      >

        {sortedOccurrences.map((occ) => (
          <OccurrenceCard
            key={occ.id}
            name={occ.name}
            description={occ.description}
            criticity={occ.criticity as "A" | "B" | "C"}
            createdAt={occ.createdAt ?? ""}
            image={occ.image}
            onDelete={() => onDelete?.(occ.id!)}
            onEdit={() => onEdit?.(occ.id!)}
          />
        ))}

    </div>
  )
}