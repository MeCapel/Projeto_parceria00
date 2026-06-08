import { api } from "./api";

export interface SystemMetrics {
  activeUsersCount: number;
  disabledUsersCount: number;
  activeProjectsCount: number;
  disabledProjectsCount: number;
  activePrototypesCount: number;
  disabledPrototypesCount: number;
  activeClientsCount: number;
  disabledClientsCount: number;
  activeChecklistModelsCount: number;
  disabledChecklistModelsCount: number;
  activeOccurrencesCount: number;
  disabledOccurrencesCount: number;
}

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await api.get("/systemMetrics");
  return response.data;
};
