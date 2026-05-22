// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react"
import {
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  getProjects,
  type ProjectProps
} from "../services/projects.service"
import { getUserProjects } from "../services/projectMembers.service";
import { getCurrentUser } from "../services/auth.service"

// ===== INTERFACES =====
interface CreateProjectDTO {
  name: string,
  description: string,
}

interface UpdateProjectDTO {
  id: string,
  name: string,
  description: string,
}

// ===== HOOK ===== 
export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectProps[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingUserProjects, setLoadingUserProjects] = useState(false);

  // ----- Get all -----
  const fetchProjects = async () => {
    try 
    {
      setLoadingProjects(true);

      const response = await getProjects();
      setProjects(response.data || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar clientes:", err);
    } 
    finally 
    {
      setLoadingProjects(false);
    }
  };

  const fetchUserProjects = async () => {
    try 
    {
      const user = await getCurrentUser();

      if (!user) 
      {
        setUserProjects([]);
        return;
      }

      setLoadingUserProjects(true);

      const result = await getUserProjects(user.id);
      // const result = response.data;

      setUserProjects(result || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar projetos do usuário:", err);
    } 
    finally 
    {
      setLoadingUserProjects(false);
    }
  };

  // Carregar todos os projetos
  useEffect(() => {
    fetchProjects();
    fetchUserProjects();
  }, []);
  
  const createProject = async (data: CreateProjectDTO) => {
    try 
    {
      const result = await createProjectService(data);

      await fetchProjects();
      await fetchUserProjects();

      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao criar projeto:", err);
      throw err;
    }
  }

  const updateProject = async (data: UpdateProjectDTO) => {
    try 
    {
      const updated = await updateProjectService(data.id, {
        name: data.name,
        description: data.description,
      });

      // setProjects(prev =>
      //   prev.map(p => (p.id === data.id ? updated : p))
      // );

      await fetchProjects();
      await fetchUserProjects();

      return updated;
    } 
    catch (err) 
    {
      console.error("Erro ao atualizar projeto:", err);
      throw err;
    }
  }

  const deleteProject = async (projectId: string) => {
    try 
    {
      await deleteProjectService(projectId);

      // atualiza estado local (UX melhor)
      // setProjects(prev => prev.filter(p => p.id !== projectId));
      // setUserProjects(prev => prev.filter(p => p.id !== projectId));

      await fetchProjects();
      await fetchUserProjects();
    } 
    catch (err) 
    {
      console.error("Erro ao deletar projeto:", err);
      throw err;
    }
  }

  return {
    projects,
    userProjects,
    loadingProjects,
    loadingUserProjects,
    createProject,
    updateProject,
    deleteProject
  }
}