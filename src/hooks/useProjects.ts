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

interface CreateProjectDTO {
  name: string,
  description: string,
}

interface UpdateProjectDTO {
  id: string,
  name: string,
  description: string,
}

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectProps[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingUserProjects, setLoadingUserProjects] = useState(false);

  const fetchProjects = async () => {
    const { data } = await getProjects();
    setProjects(data);
  };

  // Carregar todos os projetos
  useEffect(() => {
    const fetchProjects = async () => {
      try 
      {
        setLoadingProjects(true);

        const response = await getProjects();
        setProjects(response.data || []);
      } 
      catch (err) 
      {
        console.error("Erro ao buscar projetos:", err);
      } 
      finally
      {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);
  
  // Carregar todos os projetos do user
  useEffect(() => {
    const fetchUserProjects = async () => {
      // const user = await getCurrentUser();

      // console.log("USER:", user);
      // console.log("USER ID:", user?.id);   

      // if (!user) 
      // {
      //   setUserProjects([]);
      //   return;
      // }

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

    fetchUserProjects();
  }, []);

  const createProject = async (data: CreateProjectDTO) => {
    try 
    {
      const result = await createProjectService(data);

      await fetchProjects();

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

      setProjects(prev =>
        prev.map(p => (p.id === data.id ? updated : p))
      );

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
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setUserProjects(prev => prev.filter(p => p.id !== projectId));
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