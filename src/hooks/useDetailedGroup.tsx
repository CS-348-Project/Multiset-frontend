import { apiService } from "@/utils/api";
import { DetailedGroup } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const useDetailedGroup = (id: number) => {
  return useQuery<DetailedGroup>({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiService.get(
        `/api/groups/?group_id=${id}&detailed=true`
      );
      return response.data[0];
    },
  });
};

export default useDetailedGroup;
