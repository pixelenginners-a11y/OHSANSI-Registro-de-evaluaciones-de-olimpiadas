import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { type ListItemsResponse } from "../types/listItem";

export const useGetListItems = (listId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['list-items', listId, page],
    queryFn: async (): Promise<ListItemsResponse> => {
      const response = await api.get(`/list-items/${listId}?page=${page}`);
      return response.data;
    },
    enabled: !!listId,
  });
};