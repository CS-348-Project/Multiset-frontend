import { apiService } from "@/utils/api";
import { DetailedGroup } from "@/types/Group";
import { useQuery } from "@tanstack/react-query";

const useDetailedGroup = (id: number) => {
  return useQuery<DetailedGroup>({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiService.get(
        `/api/groups/get?group_id=${id}&detailed=true`
      );

      return {
        ...response.data,
      };
    },
  });
};

export default useDetailedGroup;
