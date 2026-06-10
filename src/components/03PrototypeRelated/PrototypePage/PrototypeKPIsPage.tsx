import { useMemo } from "react";
import { useOccurrences } from "../../../hooks/useOccurrences";
import { PieChart, type PieData } from "../../../charts/PieChart";

interface Props {
    prototypeId: string;
}

export default function PrototypeKPIsPage({ prototypeId }: Props) {
  const { occurrences } = useOccurrences({ prototypeId });

  const occurrencesByProgress = useMemo(() => {
    const data: PieData[] = [
      { name: "Pendente", value: 0 },
      { name: "Em andamento", value: 0 },
      { name: "Concluída", value: 0 },
    ];

    occurrences.forEach((occurrence) => {
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
  }, [occurrences]);

  const occurrencesByCriticity = useMemo(() => {
    const data: PieData[] = [
      { name: "A", value: 0 },
      { name: "B", value: 0 },
      { name: "C", value: 0 },
    ];

    occurrences.forEach((occurrence) => {
      switch (occurrence.criticity) {
        case "a":
          data[0].value += 1;
          break;

        case "b":
          data[1].value += 1;
          break;

        case "c":
          data[2].value += 1;
          break;
      }
    });

    return data;
  }, [occurrences]);

  if (
    !occurrences ||
    occurrences.length === 0
  ) {
    return <p>Nenhuma ocorrência encontrada!</p>;
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-custom-black mb-0">KPI's do protótipo</h4>
          <small className="text-muted">Acompanhe as métricas do protótipo</small>
        </div>
      </div>
    <div className="d-flex flex-wrap gap-3 justify-content-between">
      <PieChart
        title="Progresso das ocorrências do protótipo"
        data={occurrencesByProgress}
        width={450}
        height={450}
      />
      <PieChart
        title="Criticidade das ocorrências do protótipo"
        data={occurrencesByCriticity}
        width={450}
        height={450}
      />
    </div>
    </>
  );
}