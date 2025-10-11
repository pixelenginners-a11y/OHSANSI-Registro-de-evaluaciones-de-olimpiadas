import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";

export type Area = {
  id: number
  name: string
}

export type CreateAreaDto = {
  name: string
}

export type UpdateAreaDto = {
  name: string
}

export const useGetAreas = () => {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/areas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAreaDto) => {
      const token = localStorage.getItem("token");
      const res = await api.post("/areas", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAreaDto }) => {
      const token = localStorage.getItem("token");
      const res = await api.put(`/areas/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/areas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};
