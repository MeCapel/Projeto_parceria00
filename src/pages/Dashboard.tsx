import { useEffect, useState, useMemo } from "react";
import PieChart from "../components/09Dashboard/PieChart";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/config";
import {
  CollectionFill,
  CpuFill,
  CardChecklist,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import CrudPageLayout from "../components/Others/CrudPageLayout";
import CrudHeader from "../components/Others/CrudHeader";

type Category = "projects" | "prototypes" | "checklists" | "occurrences";

interface ProjectData {
  id: string;
  name: string;
  status?: string;
}

interface PrototypeData {
  id: string;
  name: string;
  stage?: string;
}

interface ChecklistData {
  id: string;
  name: string;
  vertical?: string;
}

interface OccurrenceData {
  id: string;
  name: string;
  status?: string;
  criticity?: string;
}

type DashboardItem =
  | ProjectData
  | PrototypeData
  | ChecklistData
  | OccurrenceData;

type GroupedData = {
  count: number;
  color: string;
  items: DashboardItem[];
};

type ChartDataItem = {
  label: string;
  value: number;
  color: string;
  items: DashboardItem[];
};

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("occurrences");

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [prototypes, setPrototypes] = useState<PrototypeData[]>([]);
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [occurrences, setOccurrences] = useState<OccurrenceData[]>([]);

  useEffect(() => {
    const unsubscribeProjects = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        setProjects(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as ProjectData)
          )
        );
      }
    );

    const unsubscribePrototypes = onSnapshot(
      collection(db, "prototypes"),
      (snapshot) => {
        setPrototypes(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as PrototypeData)
          )
        );
      }
    );

    const unsubscribeChecklists = onSnapshot(
      collection(db, "checklistModels"),
      (snapshot) => {
        setChecklists(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as ChecklistData)
          )
        );
      }
    );

    const unsubscribeOccurrences = onSnapshot(
      collection(db, "occurrences"),
      (snapshot) => {
        setOccurrences(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as OccurrenceData)
          )
        );
      }
    );

    return () => {
      unsubscribeProjects();
      unsubscribePrototypes();
      unsubscribeChecklists();
      unsubscribeOccurrences();
    };
  }, []);

  // =========================
  // PROCESSAMENTO
  // =========================

  const processedData = useMemo<Record<string, GroupedData>>(() => {
    const groups: Record<string, GroupedData> = {};

    if (selectedCategory === "projects") {
      projects.forEach((p) => {
        const status = p.status || "Sem Status";

        groups[status] ??= {
          count: 0,
          color: "#34A853", // Green
          items: [],
        };

        groups[status].count++;
        groups[status].items.push(p);
      });
    }

    if (selectedCategory === "prototypes") {
      prototypes.forEach((p) => {
        const stage = p.stage || "Não Informada";

        groups[stage] ??= {
          count: 0,
          color: "#4285F4", // Blue
          items: [],
        };

        groups[stage].count++;
        groups[stage].items.push(p);
      });
    }

    if (selectedCategory === "checklists") {
      checklists.forEach((c) => {
        const vertical = c.vertical || "Sem Vertical";

        groups[vertical] ??= {
          count: 0,
          color: "#FBBC05", // Yellow
          items: [],
        };

        groups[vertical].count++;
        groups[vertical].items.push(c);
      });
    }

    if (selectedCategory === "occurrences") {
      occurrences.forEach((o) => {
        const criticity = o.criticity?.trim() || "Não Definida";

        let color = "#4285F4"; // Default Blue
        const upper = criticity.toUpperCase();

        if (upper === "A" || upper.startsWith("CRITICIDADE A")) color = "#EA4335"; // Red
        if (upper === "B" || upper.startsWith("CRITICIDADE B")) color = "#FBBC05"; // Yellow
        if (upper === "C" || upper.startsWith("CRITICIDADE C")) color = "#34A853"; // Green

        groups[criticity] ??= {
          count: 0,
          color,
          items: [],
        };

        groups[criticity].count++;
        groups[criticity].items.push(o);
      });
    }

    return groups;
  }, [selectedCategory, projects, prototypes, checklists, occurrences]);

  // =========================
  // CHART DATA (FIX PRINCIPAL)
  // =========================

  const chartData = useMemo<ChartDataItem[]>(() => {
    return Object.entries(processedData).map(([label, info]) => ({
      label,
      value: info.count,
      color: info.color,
      items: info.items,
    }));
  }, [processedData]);

  // =========================
  // TITLES
  // =========================

  const getTitle = () => {
    switch (selectedCategory) {
      case "projects":
        return "Distribuição de Projetos";
      case "prototypes":
        return "Distribuição de Protótipos";
      case "checklists":
        return "Distribuição de Checklists";
      case "occurrences":
        return "Distribuição de Ocorrências";
    }
  };

  const getSummaryTitle = () => {
    switch (selectedCategory) {
      case "projects":
        return "Status dos Projetos";
      case "prototypes":
        return "Etapas dos Protótipos";
      case "checklists":
        return "Verticals dos Checklists";
      case "occurrences":
        return "Status das Ocorrências";
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <CrudPageLayout
      header={
        <>
          <CrudHeader
            title="Dashboard"
            subtitle="Análise de Dados dos Projetos"
          />
          <div className="d-flex justify-content-center mb-5">
            <div className="p-3 bg-white border rounded-3 shadow-sm d-flex flex-wrap justify-content-center gap-4">
              {[
                { id: "projects", label: "Projetos", icon: <CollectionFill />, count: projects.length, color: "#34A853" },
                { id: "prototypes", label: "Protótipos", icon: <CpuFill />, count: prototypes.length, color: "#4285F4" },
                { id: "checklists", label: "Checklists", icon: <CardChecklist />, count: checklists.length, color: "#FBBC05" },
                { id: "occurrences", label: "Ocorrências", icon: <ExclamationTriangleFill />, count: occurrences.length, color: "#EA4335" },
              ].map((cat) => (
                <button 
                  key={cat.id}
                  className={`btn-custom d-flex align-items-center justify-content-center px-5 py-2 transition-all ${selectedCategory === cat.id ? "shadow" : "btn-custom-outline-primary"}`} 
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  style={{ 
                    transform: selectedCategory === cat.id ? "scale(1.05)" : "scale(1)",
                    fontWeight: "600",
                    backgroundColor: selectedCategory === cat.id ? cat.color : "transparent",
                    color: selectedCategory === cat.id ? "white" : cat.color,
                    borderColor: cat.color,
                    borderWidth: "1px",
                    borderStyle: "solid"
                  }}
                >
                  <span className="me-2">{cat.icon}</span>
                  {cat.label}
                  <span className={`ms-2 badge rounded-pill ${selectedCategory === cat.id ? "bg-white text-primary" : "bg-light text-secondary border"}`} style={{ fontSize: "0.7rem", color: selectedCategory === cat.id ? cat.color : "inherit" }}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      }
      list={
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5">
            <div className="card p-4 shadow-sm border-0 h-100">
              <h5 className="mb-4 fw-bold text-secondary text-center">{getTitle()}</h5>
              <div className="d-flex justify-content-center align-items-center h-100">
                {chartData.length > 0 ? (
                  <PieChart
                    title={selectedCategory}
                    data={chartData}
                    formatTooltip={(data) =>
                      `${data.label}: ${data.value}`
                    }
                  />
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">Nenhum dado disponível para esta categoria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card p-4 shadow-sm border-0 h-100">
              <h5 className="mb-4 fw-bold text-secondary text-center">{getSummaryTitle()}</h5>
              <div className="row g-3 justify-content-center">
                {Object.entries(processedData).map(([label, info]) => (
                  <div key={label} className="col-12">
                    <div className="p-3 border rounded-3 bg-white shadow-sm d-flex align-items-center justify-content-center gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle" 
                          style={{ width: "12px", height: "12px", backgroundColor: info.color }}
                        />
                        <span className="fw-medium">{label}</span>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        {info.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
