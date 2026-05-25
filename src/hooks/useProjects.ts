// ===== IMPORTS =====
import { useEffect, useState } from "react";
import {
  type ProjectProps,
  getProjects as getProjectsService,
  getProject as getProjectService,
  createProject as createProjectService,
  updateProject as updateProjectService,
  changeProjectStatus as changeProjectStatusService,
  deleteProject as deleteProjectService,
} from "../services/projects.service";

import {
  getUserProjects,
} from "../services/projectMembers.service";

// ===== TYPES =====

interface CreateProjectDTO {
  name: string;
  description?: string;
}

interface UpdateProjectDTO extends CreateProjectDTO {
  id: string;
}

interface FetchProjectsOptions {
  reset?: boolean;
  limit?: number;
  filters?: {
    status?: "active" | "disabled";
  };
}

interface UseProjectsProps {
  userId?: string;
  skip?: boolean;
}

// ===== HOOK =====
export const useProjects = (props?: UseProjectsProps) => {

  // ===== PARAMS =====
  const userId = props?.userId;
  const skip = props?.skip;

  // ===== STATES =====
  const [project, setProject] = useState<ProjectProps | null>(null);

  const [projects, setProjects] = useState<ProjectProps[]>([]);

  const [loading, setLoading] = useState(false);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);

  // filtros atuais
  const [filters, setFilters] =
    useState<{
      status?: "active" | "disabled";
    }>({});

  // ===== GET ALL =====
  const fetchProjects = async (options?: FetchProjectsOptions) => {
    try
    {
      setLoading(true);

      const isReset = options?.reset ?? false;

      const currentFilters = options?.filters ?? filters;

      // reset paginação
      if (isReset)
      {
        setCursor(null);
        setHasMore(true);
        setFilters(currentFilters);
      }

      // ===== USER PROJECTS =====
      if (userId)
      {
        const response =
          await getUserProjects(userId);

        const projects =
          Array.isArray(response)
            ? response
            : response.data || [];

        const filteredData =
          currentFilters.status
            ? projects.filter(
                (p: ProjectProps) =>
                  p.status === currentFilters.status
              )
            : projects;

        setProjects(filteredData);

        setHasMore(false);

        return;
      }

      // ===== NORMAL PROJECTS =====
      const response =
        await getProjectsService({
          limit: options?.limit ?? 10,

          cursor:
            isReset
              ? null
              : cursor,

          status:
            currentFilters.status,
        });

      // RESET
      if (isReset)
      {
        setProjects(response.data || []);
      }

      // LOAD MORE
      else
      {
        setProjects(prev => [
          ...prev,
          ...response.data,
        ]);
      }

      setCursor(
        response.pagination.nextCursor
      );

      setHasMore(
        response.pagination.hasMore
      );
    }
    catch (err)
    {
      console.error(
        "Erro ao buscar projetos:",
        err
      );
    }
    finally
    {
      setLoading(false);
    }
  };

  // ===== LOAD MORE =====
  const loadMore = async () => {

    if (
      !hasMore ||
      loading ||
      userId
    ) return;

    await fetchProjects({
      filters,
    });
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    if (skip) return;

    fetchProjects({
      reset: true,
    });

  }, [userId, skip]);

  // ===== GET ONE =====
  const getProject = async (
    id: string
  ) => {

    try
    {
      const data =
        await getProjectService(id);

      setProject(data);
    }
    catch (err)
    {
      console.error(
        "Erro ao buscar projeto:",
        err
      );
    }
  };

  // ===== CREATE =====
  const createProject = async (
    data: CreateProjectDTO
  ) => {

    try
    {
      const result =
        await createProjectService(data);

      await fetchProjects({
        reset: true,
        filters,
      });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao criar projeto:",
        err
      );

      throw err;
    }
  };

  // ===== UPDATE =====
  const updateProject = async (
    data: UpdateProjectDTO
  ) => {

    try
    {
      const result =
        await updateProjectService(
          data.id,
          {
            name: data.name,
            description: data.description,
          }
        );

      await fetchProjects({
        reset: true,
        filters,
      });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao atualizar projeto:",
        err
      );

      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changeProjectStatus = async (
    id: string,
    status: "active" | "disabled"
  ) => {

    try
    {
      const result =
        await changeProjectStatusService(
          id,
          status
        );

      await fetchProjects({
        reset: true,
        filters,
      });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao alterar status do projeto:",
        err
      );

      throw err;
    }
  };

  // ===== DELETE =====
  const deleteProject = async (
    projectId: string
  ) => {

    try
    {
      await deleteProjectService(
        projectId
      );

      await fetchProjects({
        reset: true,
        filters,
      });
    }
    catch (err)
    {
      console.error(
        "Erro ao deletar projeto:",
        err
      );

      throw err;
    }
  };

  // ===== RETURN =====
  return {

    // states
    project,
    projects,

    loading,

    cursor,
    hasMore,

    filters,

    // fetch
    fetchProjects,
    loadMore,

    // crud
    getProject,

    createProject,
    updateProject,

    changeProjectStatus,

    deleteProject,
  };
};