// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";

import {
  getProjectMembers,
  getProjectMember,
  getUsersNotInProject,
  addProjectMember as addProjectMemberService,
  removeProjectMember as removeProjectMemberService,
  type ProjectMember,
} from "../services/projectMembers.service";

// ===== HOOK =====
export const useProjectMembers = (projectId: string) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [usersNotInProject, setUsersNotInProject] = useState<ProjectMember[]>([]);

  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingUsersNotInProject, setLoadingUsersNotInProject] = useState(false);

  // ----- Get members -----
  const fetchProjectMembers = async () => {
    try 
    {
      if (!projectId) 
      {
        setMembers([]);
        return;
      }

      setLoadingMembers(true);

      const result = await getProjectMembers(projectId);

      setMembers(result || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar membros do projeto:", err);
    } 
    finally 
    {
      setLoadingMembers(false);
    }
  };

  // ----- Get users not in project -----
  const fetchUsersNotInProject = async () => {
    try 
    {
      if (!projectId) 
      {
        setUsersNotInProject([]);
        return;
      }

      setLoadingUsersNotInProject(true);

      const result = await getUsersNotInProject(projectId);

      setUsersNotInProject(result || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar usuários fora do projeto:", err);
    } 
    finally 
    {
      setLoadingUsersNotInProject(false);
    }
  };

  // ----- Get specific member -----
  const fetchProjectMember = async (userId: string) => {
    try 
    {
      const result = await getProjectMember(projectId, userId);

      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao buscar membro do projeto:", err);
      throw err;
    }
  };

  // ----- Load data -----
  useEffect(() => {
    if (!projectId) return;

    fetchProjectMembers();
    fetchUsersNotInProject();
  }, [projectId]);

  // ----- Add member -----
  const addProjectMember = async (userId: string) => {
    try 
    {
      const result = await addProjectMemberService(projectId, userId);

      await fetchProjectMembers();
      await fetchUsersNotInProject();

      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao adicionar membro ao projeto:", err);
      throw err;
    }
  };

  // ----- Remove member -----
  const removeProjectMember = async (userId: string) => {
    try 
    {
      await removeProjectMemberService(projectId, userId);

      await fetchProjectMembers();
      await fetchUsersNotInProject();
    } 
    catch (err) 
    {
      console.error("Erro ao remover membro do projeto:", err);
      throw err;
    }
  };

  return {
    members,
    usersNotInProject,

    loadingMembers,
    loadingUsersNotInProject,

    fetchProjectMembers,
    fetchUsersNotInProject,
    fetchProjectMember,

    addProjectMember,
    removeProjectMember,
  };
};