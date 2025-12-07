import { useQuery, keepPreviousData } from "@tanstack/react-query";
import logsEndpoints, { type LogFilters, type LogsResponse } from "../../../api/endpointLogs";

export const useLogs = (filters: LogFilters = {}) => {
  return useQuery<LogsResponse>({
    queryKey: ["logs", filters],
    queryFn: async () => {
      const res = await logsEndpoints.get(filters);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};
