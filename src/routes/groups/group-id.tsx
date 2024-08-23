import DefaultLayout from "@/components/layout/default-layout";
import LoadingPage from "@/components/layout/loading-page";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import Space from "@/components/ui/space";
import useDetailedGroup from "@/hooks/useDetailedGroup";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { OptimalPaymentTable } from "@/components/settlement/OptimalPaymentTable";

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
      <div className="w-full flex justify-between gap-2">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="flex items-start gap-1 mt-2">
          <UsersIcon className="w-5 h-5" />
          <span>{data.users.length}</span>
        </div>
      </div>

      <Space s="h-4" />
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/groups/${id}/purchase`, {
              replace: true,
              state: { isOpen: true },
            })
          }
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
        <Button
          variant="secondary"
          onClick={() => alert("not done yet")} // TODO: Implement this
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          Manage Group
        </Button>
      </div>

      <Space s="h-4" />

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="bg-grey text-black rounded-3xl p-4 w-full">
          <OptimalPaymentTable userOwes={true} />
        </div>
        <div className="bg-grey text-black rounded-3xl p-4 w-full">
          <OptimalPaymentTable userOwes={false} />
        </div>
      </div>
      <PurchaseHistory />
    </DefaultLayout>
  );
};

export default GroupPage;
