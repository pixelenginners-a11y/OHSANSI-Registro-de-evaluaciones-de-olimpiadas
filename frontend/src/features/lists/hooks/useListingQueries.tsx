import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { type Listing, type ListingsResponse } from "../types/listing";

export const useGetListings = (page: number = 1) => {
  return useQuery<ListingsResponse>({
    queryKey: ["listings", page],
    queryFn: async () => {
      const res = await api.get(`/listings?page=${page}`)
      if (!res) throw new Error("Error al obtener las listas")
      return res.data
    },
  })
}

export const useGetListingById = (id: number) => {
  return useQuery<Listing>({
    queryKey: ["listing", id],
    queryFn: async () => {
      const res = await api.get(`/listings/${id}`);
      if (!res) throw new Error("Error al obtener la lista");
      return res.data;
    },
    enabled: !!id,
  });
};