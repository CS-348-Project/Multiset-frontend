import { apiService } from "@/utils/api";
import { DetailedGroup } from "@/types/Group";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/types/UserInfo";

const useDetailedGroup = (id: number) => {
  return useQuery<DetailedGroup>({
    queryKey: ["group", id],
    queryFn: async () => {
      const response = await apiService.get(
        `/api/groups/get?group_id=${id}&detailed=true`
      );

      const debts = await apiService.get(
        `api/optimization/debts?group_id=${id}`
      );

      return {
        ...response.data,
        users: debts.data.map((debt: UserInfo) => {
          return { ...debt, balance: (debt.balance ?? 0) / 100 }; // Convert cents to dollars
        }),
      };
    },
  });
};

export default useDetailedGroup;
