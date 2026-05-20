import { useMemo } from "react";
import { useOccurrences } from "../../../hooks/useOccurrences";
import { PieChart, type PieData } from "../../../charts/PieChart";

interface Props {
    prototypeId: string;
}

export default function PrototypeKPIsPage({ prototypeId }: Props) {
  const { prototypeOccurrences } = useOccurrences({ prototypeId });

  const occurrencesByProgress = useMemo(() => {
    const data: PieData[] = [
      { name: "Pendente", value: 0 },
      { name: "Em andamento", value: 0 },
      { name: "Concluída", value: 0 },
    ];

    prototypeOccurrences.forEach((occurrence) => {
      switch (occurrence.progress) {
        case "pendente":
          data[0].value += 1;
          break;

        case "em andamento":
          data[1].value += 1;
          break;

        case "concluido":
          data[2].value += 1;
          break;
      }
    });

    return data;
  }, [prototypeOccurrences]);

  if (
    !prototypeOccurrences ||
    prototypeOccurrences.length === 0
  ) {
    return <p>Nenhuma ocorrência encontrada!</p>;
  }

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-between">
      <PieChart
        title="Progresso das ocorrências do protótipo"
        data={occurrencesByProgress}
        width={450}
        height={450}
      />
    </div>
  );
}