// src/features/login/hooks/useGetMe.ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../../api/auth";

export function useGetMe() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!localStorage.getItem("token"),
  });

  return {
    user: query.data?.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
