import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useGetCompetitionPhases = () => {
  return useQuery({
    queryKey: ["getCompetitionPhases"],
    queryFn: async () => {
      const res = await api.get("/admin/competition/phases");
      return res.data;
    },
  });
};