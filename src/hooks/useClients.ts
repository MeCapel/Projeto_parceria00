// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  type ClientProps,
  getClients,
  getClient as getAClient,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from "../services/clients.service";

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

interface UpdateClientDTO extends CreateClientDTO {
  id: string;
}

// ===== HOOK ===== 
export const useClients = () => {
  const [client, setClient] = useState<ClientProps | null>(null);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [loading, setLoading] = useState(false);

  // ----- Get all  -----
  const fetchClients = async () => {
    try 
    {
      setLoading(true);

      const response = await getClients();
      setClients(response.data || []);
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

  useEffect(() => {
    fetchClients();
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

      setClients(prev => [...prev, result]);
      // await fetchClients();

      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao criar cliente:", err);
      throw err;
    }
  };

  // ----- Update -----
  const updateClient = async (data: UpdateClientDTO) => {
    try 
    {
      await updateClientService(data.id, data);

      setClients(prev => prev.map(c => (c.id === data.id ? { ...c, ...data } : c)));

      // await fetchClients();
    } 
    catch (err) 
    {
      console.error("Erro ao atualizar cliente:", err);
      throw err;
    }
  };

  // ----- Delete -----
  const deleteClient = async (clientId: string) => {
    try 
    {
      await deleteClientService(clientId);

      setClients(prev => prev.filter(c => c.id !== clientId));

      // await fetchClients();
    } 
    catch (err) 
    {
      console.error("Erro ao deletar cliente:", err);
      throw err;
    }
  };

  return {
    client,
    clients,
    loading,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
  };
};