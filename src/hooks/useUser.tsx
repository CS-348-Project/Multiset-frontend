import { apiService } from "@/utils/api";
import { User } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiService.get(`/api/users/?user_id=${id}`);
      return response.data[0];
    },
  });
};

export default useUser;
