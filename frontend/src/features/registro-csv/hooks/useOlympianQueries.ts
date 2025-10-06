import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOlympians, importOlympians } from "../../../api/endpoint";

export function useOlympians() {
  return useQuery({
    queryKey: ["olympians"],
    queryFn: async () => {
      const res = await getOlympians();
      return res.data;
    },
  });
}

export function useImportOlympians() {
  return useMutation({
    mutationFn: async (args: any) => {
      const res = await importOlympians(args);
      return res.data;
    },
  });
}
