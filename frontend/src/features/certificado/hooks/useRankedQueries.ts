import { useQuery } from "@tanstack/react-query";
import { getAwarded } from "../../../api/ranked";

export const useGetAwardedByArea = (olimpiadaId: number, areaId?: number) => {
  return useQuery({
    queryKey: ["awarded", olimpiadaId, areaId],
    queryFn: async () => {
      console.log('Calling getAwarded with:', { olimpiadaId, areaId });
      const res = await getAwarded(olimpiadaId, areaId);
      console.log('Awarded API full response:', res);
      console.log('Awarded API res.data:', res.data);
      console.log('Awarded API res.data.data:', res.data.data);
      return res.data.data;
    },
    enabled: !!olimpiadaId && !!areaId, // Solo ejecutar cuando tengamos ambos IDs
  });
};
