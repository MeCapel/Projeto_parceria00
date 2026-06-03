// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";

import {
  type UserProps,

  getUsers as getUsersService,
  getUserById as getUserByIdService,

  inviteUser as inviteUserService,

  updateProfile as updateProfileService,

  changeUserStatus as changeUserStatusService,
  deleteUser as deleteUserService
} from "../services/auth.service";

// ===== TYPES =====
interface InviteUserDTO {
  username: string;
  email: string;
  role: string;
}

interface UpdateUserDTO {
  id: string;
  username?: string;
  profileImage?: string;
}

interface FetchUsersOptions {
  reset?: boolean;
  limit?: number;

  filters?: {
    status?: "active" | "disabled";
  };
}

// ===== HOOK =====
export const useUsers = () => {

  // ===== STATES =====
  const [user, setUser] =
    useState<UserProps | null>(null);

  const [users, setUsers] =
    useState<UserProps[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  const [filters, setFilters] =
    useState<{
      status?: "active" | "disabled";
    }>({});

  // ===== GET ALL =====
  const fetchUsers = async (
    options?: FetchUsersOptions
  ) => {

    try
    {
      setLoading(true);

      const isReset =
        options?.reset ?? false;

      const currentFilters =
        options?.filters ?? filters;

      if (isReset)
      {
        setCursor(null);

        setHasMore(true);

        setFilters(currentFilters);
      }

      const response =
        await getUsersService({
          limit:
            options?.limit ?? 10,

          cursor:
            isReset
              ? null
              : cursor,

          status:
            currentFilters.status,
        });

      if (isReset)
      {
        setUsers(
          response.data || []
        );
      }
      else
      {
        setUsers(prev => [
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
        "Erro ao buscar usuários:",
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
      loading
    ) return;

    await fetchUsers({
      filters,
    });

  };

  // ===== INITIAL LOAD =====
  useEffect(() => {

    fetchUsers({
      reset: true,
    });

  }, []);

  // ===== GET ONE =====
  const getUser = async (id: string) => {
    try
    {
      const data =
        await getUserByIdService(id);

      setUser(data);
    }
    catch (err)
    {
      console.error(
        "Erro ao buscar usuário:",
        err
      );
    }
  };

  // ===== CREATE =====
  const inviteUser = async (data: InviteUserDTO) => {
    try
    {
      const result =
        await inviteUserService(data);

      await fetchUsers({ reset: true, filters });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao convidar usuário:",
        err
      );

      throw err;
    }
  };

  // ===== UPDATE =====
  const updateUser = async (data: UpdateUserDTO) => {
    try
    {
      const result =
        await updateProfileService(
          data.id,
          {
            username:
              data.username,

            profileImage:
              data.profileImage,
          }
        );

      await fetchUsers({
        reset: true,
        filters,
      });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao atualizar usuário:",
        err
      );

      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changeUserStatus = async (id: string,status: "active" | "disabled") => {
    try
    {
      const result =
        await changeUserStatusService(
          id,
          status
        );

      await fetchUsers({
        reset: true,
        filters,
      });

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao alterar status do usuário:",
        err
      );

      throw err;
    }
  };

    // ----- Delete -----
    const deleteUser = async (clientId: string) => {
      try 
      {
        await deleteUserService(clientId);
  
        // setClients(prev => prev.filter(c => c.id !== clientId));
  
        await fetchUsers();
      } 
      catch (err) 
      {
        console.error("Erro ao deletar usuário:", err);
        throw err;
      }
    };

  // ===== RETURN =====
  return {

    // states
    user,
    users,

    loading,

    cursor,
    hasMore,

    filters,

    // fetch
    fetchUsers,
    loadMore,

    // crud
    getUser,

    inviteUser,
    updateUser,

    changeUserStatus,
    deleteUser
  };
};