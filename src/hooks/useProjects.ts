import { useEffect, useState } from "react"
import type { ProjectProps } from "../services/projectServices"
import {
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProjectNPrototypes,
  getUserProjects,
  getProjects
} from "../services/projectServices"
import { getCurrentUser } from "../services/authServices"

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      setUserProjects([]) ;
      setLoading(false);
      return;
    }

    setLoading(true)

    const unsubscribe = getUserProjects(user.uid, (userProjectsList) => {
      setUserProjects(userProjectsList || []);
      setLoading(false);
    })

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      setProjects([]) ;
      setLoading(false);
      return;
    }

    setLoading(true)

    const unsubscribe = getProjects((projectsList) => {
      setProjects(projectsList || []);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [])

  const createProject = async (data: CreateProjectDTO) => {
    const user = getCurrentUser();
    if (!user) return;

    await createProjectService(data.name, data.description, user.uid);
  }

  const updateProject = async (data: UpdateProjectDTO) => {
    await updateProjectService(data.id, data.name, data.description);
  }

  const deleteProject = async (projectId: string) => {
    await deleteProjectNPrototypes(projectId);
  }

  return {
    projects,
    userProjects,
    loading,
    createProject,
    updateProject,
    deleteProject
  }
}