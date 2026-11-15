import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CrudHeader from "../Others/CrudHeader";
import { CrudTable } from "../Others/CrudTable";
import SearchInput from "../forms/SearchInput";
import { getProjects, type ProjectProps } from "../../services/projects.service";
import { getPrototypes, type PrototypeProps } from "../../services/prototypes.service";

interface HomePrototype extends PrototypeProps {
  projectName: string;
}

export default function HomePrototypes() {
  const navigate = useNavigate();
  const [prototypes, setPrototypes] = useState<HomePrototype[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPrototypes = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const projects: ProjectProps[] = [];
        let projectCursor: string | null = null;
        let hasMoreProjects = true;

        while (hasMoreProjects) {
          const response = await getProjects({
            limit: 50,
            cursor: projectCursor,
          });

          projects.push(...response.data.filter((project) => project.status === "active"));
          projectCursor = response.pagination.nextCursor;
          hasMoreProjects = response.pagination.hasMore;
        }

        const projectPrototypeGroups: HomePrototype[][] = [];

        for (let index = 0; index < projects.length; index += 4) {
          const projectBatch = projects.slice(index, index + 4);
          const groups = await Promise.all(projectBatch.map(async (project) => {
            const projectPrototypes: PrototypeProps[] = [];
            let prototypeCursor: string | null = null;
            let hasMorePrototypes = true;

            while (hasMorePrototypes) {
              const response = await getPrototypes({
                projectId: project.id,
                limit: 50,
                cursor: prototypeCursor,
                status: "active",
              });

              projectPrototypes.push(...response.data);
              prototypeCursor = response.pagination.nextCursor;
              hasMorePrototypes = response.pagination.hasMore;
            }

            return projectPrototypes.map((prototype) => ({
              ...prototype,
              projectName: project.name,
            }));
          }));

          projectPrototypeGroups.push(...groups);
        }

        if (!cancelled) {
          setPrototypes(projectPrototypeGroups.flat());
        }
      } catch (error) {
        console.error("Erro ao carregar protótipos da Home:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPrototypes();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = search.trim().toLocaleLowerCase();
  const filteredPrototypes = prototypes.filter((prototype) =>
    [prototype.name, prototype.code, prototype.projectName]
      .some((value) => value?.toLocaleLowerCase().includes(query))
  );

  return (
    <section className="p-5 mx-3">
      <CrudHeader
        title="Protótipos"
        subtitle="Gerencie seus protótipos"
      />

      <div className="pb-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar protótipo, série ou projeto..."
        />
      </div>

      {loading ? (
        <p className="py-4 text-center text-muted">Carregando protótipos...</p>
      ) : loadError ? (
        <p className="py-4 text-center text-danger">Não foi possível carregar os protótipos.</p>
      ) : filteredPrototypes.length === 0 ? (
        <div className="w-100 py-5 text-center border rounded bg-light">
          <p className="text-muted mb-0">
            {search ? "Nenhum protótipo corresponde à sua busca." : "Nenhum protótipo ativo encontrado."}
          </p>
        </div>
      ) : (
        <CrudTable
          headers={["Nome", "Projeto", "N° de série", "Etapa", "Vertical"]}
          data={filteredPrototypes}
          getId={(prototype) => prototype.id}
          onRowClick={(prototype) => navigate(`/projects/${prototype.projectId}/${prototype.id}`)}
          renderRow={(prototype) => (
            <>
              <td className="px-4 text-secondary">{prototype.name}</td>
              <td className="px-4 text-secondary">{prototype.projectName}</td>
              <td className="px-4 text-secondary">{prototype.code || "-"}</td>
              <td className="px-4 text-secondary">{prototype.stageLabel}</td>
              <td className="px-4 text-secondary">{prototype.verticalLabel}</td>
            </>
          )}
        />
      )}
    </section>
  );
}
