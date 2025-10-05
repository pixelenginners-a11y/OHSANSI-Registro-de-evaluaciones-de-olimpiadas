import { useQuery } from "@tanstack/react-query";
import { getGrades, getGradeById } from "../../../api/grades";
import type { Nivel } from "../types";

export const useGetGrades = () => {
  return useQuery<Nivel[]>({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await getGrades();
      return res.data;
    },
  });
};

export const useGetGradeById = (id: number) => {
  return useQuery<Nivel>({
    queryKey: ["grade", id],
    queryFn: async () => {
      const res = await getGradeById(id);
      return res.data;
    },
    enabled: !!id,
  });
};
