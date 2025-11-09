import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import {
  type Listing,
  type CreateListingData,
  type UpdateListingData
} from "../types/listing";

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, CreateListingData>({
    mutationFn: async (data) => {
      const res = await api.post("/listings", data);
      if (!res) throw new Error("Error al crear la lista");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, { id: number; data: UpdateListingData }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/listings/${id}`, data);
      if (!res) throw new Error("Error al actualizar la lista");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    },
  });
};

export const usePatchListing = () => {
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, { id: number; data: Partial<Listing> }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/listings/${id}`, data);
      if (!res) throw new Error("Error al actualizar parcialmente la lista");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete(`/listings/${id}`);
      if (!res) throw new Error("Error al eliminar la lista");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
