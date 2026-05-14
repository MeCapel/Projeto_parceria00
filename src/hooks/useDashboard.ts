import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardKPIs,
} from "../services/dashboardService";

export const useDashboard =
  () => {

    const [loading, setLoading] =
      useState(true);

    const [kpis, setKpis] =
      useState({
        totalProjects: 0,
      });

    useEffect(() => {

      const fetchKPIs =
        async () => {

          try {

            console.log(
              "Buscando KPIs..."
            );

            const data =
              await getDashboardKPIs();

            console.log(data);

            setKpis(data);

          } catch (error) {

            console.error(error);

          } finally {

            setLoading(false);

          }

        };

      fetchKPIs();

    }, []);

    return {
      loading,
      kpis,
    };
  };

// ISIS