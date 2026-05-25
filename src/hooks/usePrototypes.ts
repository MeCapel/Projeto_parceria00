// ===== usePrototypes.ts =====

// ===== IMPORTS =====
import { useEffect, useState } from "react";

import {
  type PrototypeProps,

  getPrototypes as getPrototypesService,
  getPrototype as getPrototypeService,

  createPrototype as createPrototypeService,
  updatePrototype as updatePrototypeService,

  changePrototypeStatus as changePrototypeStatusService,

  deletePrototype as deletePrototypeService,
} from "../services/prototypes.service";

// ===== TYPES =====

export interface CreatePrototypeDTO {
  code?: string;
  name: string;
  description: string;
  stage: string;
  vertical: string;
  projectId: string;
  clientId?: string;
  location?: {
    state?: string;
    city?: string;
  };
  areaSize?: number;
  createdBy?: string;
  createdAt?: string;
  checklistModelIds?: string[];
}

interface UpdatePrototypeDTO extends Partial<CreatePrototypeDTO> {
  id: string;
}

interface FetchPrototypesOptions {
  reset?: boolean;
  limit?: number;
  filters?: {
    projectId?: string;
    status?: "active" | "disabled";
  };
}

interface UsePrototypesProps {
  projectId?: string;
  status?: "active" | "disabled";
}

// ===== HOOK =====
export const usePrototypes = (props?: UsePrototypesProps) => {

  // ===== PARAMS =====
  const projectId =
    props?.projectId;

  // ===== STATES =====
  const [prototype, setPrototype] =
    useState<PrototypeProps | null>(null);

  const [prototypes, setPrototypes] =
    useState<PrototypeProps[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  // filtros atuais
  const [filters, setFilters] =
    useState<{
      projectId?: string;

      status?: "active" | "disabled";
    }>({});

  // ===== GET ALL =====
  const fetchPrototypes = async (
    options?: FetchPrototypesOptions
  ) => {

    try
    {
      setLoading(true);

      const isReset =
        options?.reset ?? false;

      const currentFilters =
        options?.filters ?? filters;

      // reset paginação
      if (isReset)
      {
        setCursor(null);

        setHasMore(true);

        setFilters(currentFilters);
      }

      const response =
        await getPrototypesService({
          limit:
            options?.limit ?? 10,

          cursor:
            isReset
              ? null
              : cursor,

          projectId:
            projectId
              ?? currentFilters.projectId,

          status:
            currentFilters.status,
        });

      // RESET
      if (isReset)
      {
        setPrototypes(
          response.data || []
        );
      }

      // LOAD MORE
      else
      {
        setPrototypes(prev => [
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
        "Erro ao buscar protótipos:",
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

    await fetchPrototypes({
      filters,
    });

  };

  // ===== INITIAL LOAD =====
  useEffect(() => {

    fetchPrototypes({
      reset: true,

      filters: {
        projectId,
        status: props?.status
      },
    });

  }, [projectId, props?.status]);

  // ===== GET ONE =====
  const getPrototype = async (
    id: string
  ) => {

    try
    {
      setLoading(true);

      const data =
        await getPrototypeService(id);

      setPrototype(data);
    }
    catch (err)
    {
      console.error(
        "Erro ao buscar protótipo:",
        err
      );
    }
    finally
    {
      setLoading(false);
    }
  };

  // ===== PATCH SINGLE =====
  const patchPrototype = (
    data: Partial<PrototypeProps>
  ) => {

    setPrototype(prev =>
      prev
        ? {
            ...prev,
            ...data,
          }
        : prev
    );

  };

  // ===== CREATE =====
  const createPrototype = async (
    data: CreatePrototypeDTO
  ) => {

    try
    {
      const result =
        await createPrototypeService(data);

        // ===== UPDATE LIST =====
        setPrototypes(prev => [
          result,
          ...prev,
        ]);

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao criar protótipo:",
        err
      );

      throw err;
    }
  };

  // ===== UPDATE =====
  const updatePrototype = async (
    data: UpdatePrototypeDTO
  ) => {

    try
    {
      const result =
        await updatePrototypeService(
          data.id,
          data
        );

      // ===== UPDATE SINGLE =====
      setPrototype(prev =>
        prev?.id === data.id
          ? {
              ...prev,
              ...data,
            }
          : prev
      );

      // ===== UPDATE LIST =====
      setPrototypes(prev =>
        prev.map(p =>
          p.id === data.id
            ? {
                ...p,
                ...data,
              }
            : p
        )
      );

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao atualizar protótipo:",
        err
      );

      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changePrototypeStatus = async (
    id: string,

    status: "active" | "disabled"
  ) => {

    try
    {
      const result =
        await changePrototypeStatusService(
          id,
          status
        );

      // ===== UPDATE SINGLE =====
      setPrototype(prev =>
        prev?.id === id
          ? {
              ...prev,
              status,
            }
          : prev
      );

      // ===== UPDATE LIST =====
      setPrototypes(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                status,
              }
            : p
        )
      );

      return result;
    }
    catch (err)
    {
      console.error(
        "Erro ao alterar status do protótipo:",
        err
      );

      throw err;
    }
  };

  // ===== DELETE =====
  const deletePrototype = async (
    prototypeId: string
  ) => {

    try
    {
      await deletePrototypeService(
        prototypeId
      );

      // ===== REMOVE FROM LIST =====
      setPrototypes(prev =>
        prev.filter(
          p => p.id !== prototypeId
        )
      );

      // ===== CLEAR SINGLE =====
      setPrototype(prev =>
        prev?.id === prototypeId
          ? null
          : prev
      );
    }
    catch (err)
    {
      console.error(
        "Erro ao deletar protótipo:",
        err
      );

      throw err;
    }
  };

  // ===== RETURN =====
  return {

    // states
    prototype,
    prototypes,

    loading,

    cursor,
    hasMore,

    filters,

    // fetch
    fetchPrototypes,
    loadMore,

    // crud
    getPrototype,

    createPrototype,
    updatePrototype,

    patchPrototype,

    changePrototypeStatus,

    deletePrototype,
  };
};