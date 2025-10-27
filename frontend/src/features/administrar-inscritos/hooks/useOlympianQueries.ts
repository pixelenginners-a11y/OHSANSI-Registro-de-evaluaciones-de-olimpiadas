import { useQuery } from "@tanstack/react-query";
import { getOlympians, getOlympianById } from "../../../api/olympians";

export const useGetOlympians = () => {
  return useQuery({
    queryKey: ["olympians"],
    queryFn: async () => {
      const res = await getOlympians();
      return res.data;
    }, 
  }); 
};

export const useGetOlympianById = (id: number) => {
  return useQuery({
    queryKey: ["olympian", id],
    queryFn: async () => {
      const res = await getOlympianById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};
