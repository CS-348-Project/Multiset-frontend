import DefaultLayout from "@/components/layout/default-layout";
import LoadingPage from "@/components/layout/loading-page";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import Space from "@/components/ui/space";
import UserBadge from "@/components/ui/users/user-badge";
import useDetailedGroup from "@/hooks/useDetailedGroup";
import { User } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";

const GroupPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  if (!id) navigate("/home");

  const { data, isLoading } = useDetailedGroup(parseInt(id as string));

  if (isLoading || !data) {
    return <LoadingPage />;
  }

  return (
    <DefaultLayout>
      <div className="w-full h-full px-6 py-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>

        <Space s="h-8" />

        <div className="bg-creme text-dusk rounded-lg shadow p-6">
          <h2 className="text-xl font-medium mb-4">Members</h2>
          <div className="flex flex-col gap-4">
            {data.users.map((user: User) => (
              <UserBadge user={user} />
            ))}
          </div>
        </div>
        <div className="h-8" />
        <PurchaseHistory />
      </div>
    </DefaultLayout>
  );
};

export default GroupPage;
