import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:3000/api/v1",

  withCredentials: true,
});

export const getDashboardKPIs =
  async () => {

    const response =
      await api.get(
        "/dashboard/kpis"
      );

    return response.data;
  };

// ISIS