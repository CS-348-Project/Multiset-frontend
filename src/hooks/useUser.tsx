import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { useQuery } from "@tanstack/react-query";

const useUser = (id: number) => {
  return useQuery<UserInfo>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiService.get(`/api/users/get?user_id=${id}`);
      return response.data[0];
    },
  });
};

export default useUser;
