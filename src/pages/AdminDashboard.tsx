import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  PeopleFill,
  CollectionFill,
  PersonBadge,
  Kanban,
  CheckLg,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import { getSystemMetrics, type SystemMetrics } from "../services/systemMetrics.service";

interface CardConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  activeField: keyof SystemMetrics;
  disabledField: keyof SystemMetrics;
}

const cards: CardConfig[] = [
  {
    key: "users",
    label: "Usuários",
    icon: PeopleFill,
    path: "/users-dashboard",
    activeField: "activeUsersCount",
    disabledField: "disabledUsersCount",
  },
  {
    key: "projects",
    label: "Projetos",
    icon: CollectionFill,
    path: "/projects-dashboard",
    activeField: "activeProjectsCount",
    disabledField: "disabledProjectsCount",
  },
  {
    key: "clients",
    label: "Clientes",
    icon: PersonBadge,
    path: "/clients-dashboard",
    activeField: "activeClientsCount",
    disabledField: "disabledClientsCount",
  },
  {
    key: "prototypes",
    label: "Protótipos",
    icon: Kanban,
    path: "/prototypes-dashboard",
    activeField: "activePrototypesCount",
    disabledField: "disabledPrototypesCount",
  },
  {
    key: "checklists",
    label: "Checklists",
    icon: CheckLg,
    path: "/checklist-models-dashboard",
    activeField: "activeChecklistModelsCount",
    disabledField: "disabledChecklistModelsCount",
  },
  {
    key: "occurrences",
    label: "Ocorrências",
    icon: ExclamationTriangle,
    path: "/occurrences-dashboard",
    activeField: "activeOccurrencesCount",
    disabledField: "disabledOccurrencesCount",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 mx-3">
      <div className="mb-4">
        <p className="mb-0 text-custom-red fs-5 ">Administrativo</p>
        <h1 className="mb-0 text-custom-black fw-bold">Painel de Controle</h1>
      </div>

      <div className="d-flex flex-wrap gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = (metrics?.[card.activeField] ?? 0) as number;
          const dis = (metrics?.[card.disabledField] ?? 0) as number;
          const total = active + dis;

          return (
            <div key={card.key} className="card-custom card-custom-hover">
              <div className="d-flex flex-column h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Icon size={32} className="text-custom-black" />
                  <span className="fw-bold fs-5 text-custom-black">{card.label}</span>
                </div>

                {loading ? (
                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="skeleton skeleton-text" style={{ width: "60%" }} />
                    <div className="skeleton skeleton-text" style={{ width: "40%" }} />
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-1 mb-3">
                    <span className="text-custom-green small">
                      ● {active} ativo{active !== 1 ? "s" : ""}
                    </span>
                    {dis > 0 && (
                      <span className="text-custom-red small">
                        ● {dis} desativado{dis !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="text-custom-black small fw-semibold">
                      Total: {total}
                    </span>
                  </div>
                )}

                <div className="mt-auto">
                  <button
                    className="btn-custom btn-custom-outline-black w-100"
                    onClick={() => navigate(card.path)}
                  >
                    Acessar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
