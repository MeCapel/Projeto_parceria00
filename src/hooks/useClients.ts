// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  type ClientProps,
  getClients,
  getClient as getAClient,
  createClient as createClientService,
  updateClient as updateClientService,
  changeClientStatus as changeClientStatusService,
  deleteClient as deleteClientService,
} from "../services/clients.service";
import { showErrorToast } from "../utils/errorToast";

// ===== INTERFACES =====
interface CreateClientDTO {
  name: string;
  clientFone: string;
  revend: string;
  revendFone: string;
  state: string;
  city: string;
  area: string;
}

interface FetchClientsOptions {
  reset?: boolean;
  limit?: number;
  filters?: {
    status?: "active" | "disabled";
  };
}

interface UpdateClientDTO extends CreateClientDTO {
  id: string;
}

// ===== HOOK ===== 
export const useClients = () => {
  const [client, setClient] = useState<ClientProps | null>(null);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // salva os filtros atuais
  const [filters, setFilters] = useState<{
    status?: "active" | "disabled";
  }>({});

  // ----- Get all  -----
  const fetchClients = async (options?: FetchClientsOptions) => {
  try 
  {
    setLoading(true);

    const isReset = options?.reset ?? false;

    // filtros novos OU mantém antigos
    const currentFilters = options?.filters ?? filters;

    // se resetar:
    // limpa cursor e salva filtros
    if (isReset) {
      setCursor(null);
      setHasMore(true);
      setFilters(currentFilters);
    }

    const response = await getClients({
      limit: options?.limit ?? 10,
      cursor: isReset
        ? null
        : cursor,
      status: currentFilters.status,
    });

    // RESET
    if (isReset) setClients(response.data || []);

    // LOAD MORE
    else 
      {
      setClients(prev => [
        ...prev,
        ...response.data,
      ]);
    }

    setCursor(response.pagination.nextCursor);
    setHasMore(response.pagination.hasMore);
  }
  catch (err) 
  {
    console.error("Erro ao buscar clientes:", err);
  }
  finally 
  {
    setLoading(false);
  }
};

 // ===== LOAD MORE =====
  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchClients({ filters });
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchClients({ reset: true });
  }, []);

  // ----- Get one -----
  const getClient = async (clientId: string) => {
    try 
    {
      const data = await getAClient(clientId);
      setClient(data);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar cliente:", err);
    }
  };

  // ----- Create -----
  const createClient = async (data: CreateClientDTO) => {
    try 
    {
      const result = await createClientService(data);

      // setClients(prev => [result, ...prev]);
      await fetchClients();

      return result;
    } 
    catch (err) 
    {
      showErrorToast(err);
      console.error("Erro ao criar cliente:", err);
      throw err;
    }
  };

  // ----- Update -----
  const updateClient = async (data: UpdateClientDTO) => {
    try 
    {
      await updateClientService(data.id, data);

      // setClients(prev => prev.map(c => (c.id === data.id ? { ...c, ...data } : c)));

      await fetchClients();
    } 
    catch (err) 
    {
      showErrorToast(err);
      console.error("Erro ao atualizar cliente:", err);
      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changeClientStatus = async (id: string, status: "active" | "disabled") => {
    try {
      const result = await changeClientStatusService(id, status);

      // mantém consistência da lista (recarrega com filtros atuais)
      await fetchClients({ reset: true, filters });

      // setClients(prev => [ ...prev, result]);

      return result;
    } catch (err) 
    {
      showErrorToast(err);
      console.error("Erro ao alterar status do cliente:", err);
      throw err;
    }
  };

  // ----- Delete -----
  const deleteClient = async (clientId: string) => {
    try 
    {
      await deleteClientService(clientId);

      // setClients(prev => prev.filter(c => c.id !== clientId));

      await fetchClients();
    } 
    catch (err) 
    {
      showErrorToast(err);
      console.error("Erro ao deletar cliente:", err);
      throw err;
    }
  };

  return {
    client,
    clients,
    loading,
    cursor,
    hasMore,
    filters,
    fetchClients,
    loadMore,
    getClient,
    createClient,
    updateClient,
    changeClientStatus,
    deleteClient,
  };
};