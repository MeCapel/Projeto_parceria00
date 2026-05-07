import { useEffect, useState } from "react";
import {
  type ClientProps,
  getClients,
  getClient as getAClient,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from "../services/clients.service";

interface CreateClientDTO {
  name: string;
  clientFone: string;
  revend: string;
  revendFone: string;
  state: string;
  city: string;
  area: string;
}

interface UpdateClientDTO extends CreateClientDTO {
  id: string;
}

export const useClients = () => {
  const [client, setClient] = useState<ClientProps | null>(null);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 buscar lista
  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await getClients();
      setClients(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 carregar ao iniciar
  useEffect(() => {
    fetchClients();
  }, []);

  // 🔹 criar cliente
  const createClient = async (data: CreateClientDTO) => {
    try {
      const result = await createClientService(data);

      // 🔥 atualiza lista automaticamente
      await fetchClients();

      return result;
    } catch (err) {
      console.error("Erro ao criar cliente:", err);
      throw err;
    }
  };

  // 🔹 buscar cliente específico
  const getClient = async (clientId: string) => {
    try {
      const data = await getAClient(clientId);
      setClient(data);
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
    }
  };

  // 🔹 atualizar cliente
  const updateClient = async (data: UpdateClientDTO) => {
    try {
      await updateClientService(data.id, data);

      // 🔥 update local (sem refetch completo)
      setClients(prev =>
        prev.map(c => (c.id === data.id ? { ...c, ...data } : c))
      );
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
      throw err;
    }
  };

  // 🔹 deletar cliente
  const deleteClient = async (clientId: string) => {
    try {
      await deleteClientService(clientId);

      // 🔥 remove do estado
      setClients(prev => prev.filter(c => c.id !== clientId));
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
      throw err;
    }
  };

  return {
    client,
    clients,
    loading,
    fetchClients,
    createClient,
    getClient,
    updateClient,
    deleteClient,
  };
};